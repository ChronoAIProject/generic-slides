# Sync Architecture v7.1

## Why This Exists

We run an app studio that ships 50–100 apps. Most are POCs. Most will
die in weeks. A few will find traction and need to scale. The economics
are simple: the faster we can ship and kill, the faster we find winners.

Every app — no matter how small — needs the same thing: save user data,
load it later, don't lose it. Without a shared approach, each POC
reinvents this. That means 50 different save/load implementations, 50
different data models, 50 different bugs. When a POC wins and needs to
grow, the sync layer gets rewritten from scratch because it was hacked
together for speed.

This architecture eliminates that cost. One entity model. One store
interface. One set of server endpoints. A new app clones a template,
defines its data types, and has working sync in hours — not days. When
the app dies, we drop the database and move on. When it wins, we can
upgrade its sync capabilities without rewriting the app.

There are two implementation options: **Basic** (simple, fast, no
offline) and **Full Sync** (batched, offline-capable, conflict-aware).
Both share the same entity shape, database schema, and store API. Pick
one based on the app's needs. Migrate between them if requirements
change — entity data is unchanged.

This system handles data synchronization only. Feature-specific logic
(AI generation, media uploads, imports) lives in separate endpoints
that produce entities and feed them into sync via `store.ingest()`.

---

### Changelog from v7

```
1. Batch revision allocation — allocateRevisions(n) replaces N individual
   findOneAndUpdate calls with one. Option B sync goes from ~100 Mongo
   round trips to 3 for a 50-entity batch.

2. bulkWrite in Option B sync — replaces individual insertOne/updateOne
   loop inside transaction. One bulk call for all accepted entities.

3. Store owns its own scheduler — FullSyncStore.setScheduler() replaces
   the afterMutate callback pattern. Apps can't forget to schedule sync.
   App store constructors simplified (no callback needed).

4. Cascade delete priority note — flagged as needing ref index sooner
   than originally expected. Added guidance.
```

---

## How It Works

Every app has the same structure:

```
User action → Store mutation → data persists to MongoDB → loads on next open
```

The **Store** is the FE in-memory cache. It holds entities grouped by type,
exposes queries (`byType`, `byRef`, `one`), and mutations (`create`,
`update`, `delete`). How those mutations reach the server is what differs
between the two options.

```
┌──────────────────────────────────────────────────────┐
│                  SHARED (both options)                │
│                                                      │
│  Entity shape        clientId, entityType, userId,   │
│                      revision, refs, position,       │
│                      data: {}, deletedAt, timestamps │
│                                                      │
│  FE Store            create, update, delete, ingest  │
│                      byType, byRef, one              │
│                                                      │
│  Wire format         Record<type, Record<id, Entity>>│
│                                                      │
│  Mongo               sync_entities + sync_meta       │
│                                                      │
│  Validation          Envelope only. Never inspect    │
│                      data: {}                        │
│                                                      │
│  GET /api/state      Load all on app open            │
│                                                      │
├──────────────────────┬───────────────────────────────┤
│  OPTION A            │  OPTION B                     │
│  Basic               │  Full Sync                    │
│                       │                               │
│  Each mutation →      │  Mutations queue locally →    │
│  HTTP save            │  batch push to server         │
│  (PUT/PATCH/DELETE)   │  (POST /sync)                │
│                       │                               │
│  Field-level merge    │  Entity-level LWW             │
│  Partial updates      │  Full entity replacement      │
│  No offline           │  Offline support              │
│  ~100 lines FE        │  ~300 lines FE               │
│  ~80 lines BE         │  ~100 lines BE               │
└──────────────────────┴───────────────────────────────┘
```

**Pick Option A** when the app needs to ship fast, users are online, and
simplicity matters more than durability.

**Pick Option B** when the app needs offline support, batched writes, or
provable zero data loss during sync.

Both options use the same entity shape, the same DB, and the same FE store
interface. App logic doesn't change between them.

---

## Entity

```typescript
interface Entity {
  clientId: string;               // "habit_a1b2c3d4e5f6"
  entityType: string;             // "habit"
  userId: string;                 // server-assigned, never trusted from client
  revision: number;               // server-assigned, monotonically increasing

  refs: Record<string, string>;   // relationships: { listClientId: "list_x7y8" }
  position: number;               // sibling ordering

  data: Record<string, any>;      // app-specific. sync never inspects this.

  deletedAt: string | null;       // soft delete
  createdAt: string;
  updatedAt: string;
}
```

Sync owns the envelope. Apps own `data: {}`. A habit tracker puts
`{ streak: 5 }` in data. A journal puts `{ body: "...", mood: 3 }`.
Sync doesn't care. It stores, transmits, and resolves conflicts at
the entity level regardless of what's inside.

**Relationships** use `refs`, not nesting. A task in a list:
`refs: { listClientId: "list_x7y8" }`. Query children with
`store.byRef('listClientId', parentId)`.

**Deletes** are soft. Setting `deletedAt` cascades to children
(anything referencing this entity via refs).

---

## Wire Format

```typescript
type EntityMap = Record<string, Record<string, Entity>>;
```

```json
{
  "list": {
    "list_a1b2": { "clientId": "list_a1b2", "data": { "name": "Work" }, "..." : "..." },
    "list_c3d4": { "clientId": "list_c3d4", "data": { "name": "Personal" }, "..." : "..." }
  },
  "task": {
    "task_e5f6": { "clientId": "task_e5f6", "refs": { "listClientId": "list_a1b2" }, "..." : "..." }
  }
}
```

Nested by type so `byType('task')` is O(1). Same shape in the FE store,
on the wire, and mirroring future per-type collection splits.

---

## FE Store (Shared)

Both options extend this. Mutations, queries, and `ingest` are identical.
Only `onMutate` differs — Option A saves immediately, Option B queues.

```typescript
class Store {
  private entities: Record<string, Map<string, Entity>> = {};
  private typeIndex = new Map<string, string>();  // clientId → entityType

  // ─── Internal ───

  private typeMap(t: string): Map<string, Entity> {
    if (!this.entities[t]) this.entities[t] = new Map();
    return this.entities[t];
  }

  protected set(entity: Entity): void {
    this.typeMap(entity.entityType).set(entity.clientId, entity);
    this.typeIndex.set(entity.clientId, entity.entityType);
  }

  protected get(clientId: string): Entity | undefined {
    const t = this.typeIndex.get(clientId);
    if (!t) return undefined;
    return this.entities[t]?.get(clientId);
  }

  // ─── Mutations ───

  create(entityType: string, data: Partial<Entity>, userId: string): string {
    const clientId = createClientId(entityType);
    const now = new Date().toISOString();
    this.set({
      clientId, entityType, userId,
      revision: 0, deletedAt: null,
      refs: {}, position: 0, data: {},
      createdAt: now, updatedAt: now,
      ...data,
    });
    this.onMutate(clientId, this.get(clientId)!);
    return clientId;
  }

  update(clientId: string, patch: Partial<Entity>, userId: string): void {
    const e = this.get(clientId);
    if (!e || e.deletedAt) return;
    if (patch.data) e.data = { ...e.data, ...patch.data };
    if (patch.refs) e.refs = { ...e.refs, ...patch.refs };
    if (patch.position !== undefined) e.position = patch.position;
    e.updatedAt = new Date().toISOString();
    this.onMutate(clientId, e, patch);
  }

  delete(clientId: string, userId: string): void {
    const e = this.get(clientId);
    if (!e) return;
    const now = new Date().toISOString();
    e.deletedAt = now;
    e.updatedAt = now;
    this.onMutate(clientId, e);
    for (const map of Object.values(this.entities)) {
      for (const child of map.values()) {
        if (child.deletedAt) continue;
        if (Object.values(child.refs).includes(clientId)) {
          child.deletedAt = now;
          child.updatedAt = now;
          this.onMutate(child.clientId, child);
        }
      }
    }
  }

  ingest(entity: Entity): void {
    this.set(entity); // From external systems. Already persisted. Not dirty.
  }

  // ─── Queries ───

  byType(entityType: string): Entity[] {
    const map = this.entities[entityType];
    if (!map) return [];
    return [...map.values()].filter(e => !e.deletedAt);
  }

  byRef(refKey: string, refValue: string): Entity[] {
    const results: Entity[] = [];
    for (const map of Object.values(this.entities)) {
      for (const e of map.values()) {
        if (!e.deletedAt && e.refs[refKey] === refValue) results.push(e);
      }
    }
    return results.sort((a, b) => a.position - b.position);
  }

  one(clientId: string): Entity | undefined {
    const e = this.get(clientId);
    return e?.deletedAt ? undefined : e;
  }

  // ─── Hook (overridden per option) ───

  protected onMutate(clientId: string, entity: Entity, patch?: Partial<Entity>): void {}

  // ─── Load ───

  loadFromServer(entities: Record<string, Record<string, Entity>>): void {
    this.entities = {};
    this.typeIndex.clear();
    this.onLoadReset();
    for (const entitiesOfType of Object.values(entities)) {
      for (const entity of Object.values(entitiesOfType)) {
        this.set(entity);
      }
    }
  }

  protected onLoadReset(): void {}
}

function createClientId(entityType: string): string {
  return `${entityType}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}
```

---

## Shared BE

### GET /api/state

```typescript
router.get('/api/state', authenticate, async (req, res) => {
  const { userId } = req.user;
  const entities = await db.collection('sync_entities')
    .find({ userId, deletedAt: null }).toArray();
  const meta = await db.collection('sync_meta').findOne({ userId });
  res.json({
    entities: groupEntities(entities),
    serverRevision: meta?.revision ?? 0,
  });
});
```

### Validation

```typescript
function validateEntityEnvelope(e: any): string | null {
  if (typeof e.clientId !== 'string' || !e.clientId) return 'clientId required';
  if (typeof e.entityType !== 'string' || !e.entityType) return 'entityType required';
  if (typeof e.revision !== 'number' || e.revision < 0) return 'revision invalid';
  if (typeof e.refs !== 'object' || e.refs === null) return 'refs must be object';
  if (typeof e.data !== 'object' || e.data === null) return 'data must be object';
  if (e.deletedAt !== null && typeof e.deletedAt !== 'string') return 'deletedAt invalid';
  if (typeof e.createdAt !== 'string') return 'createdAt required';
  if (typeof e.updatedAt !== 'string') return 'updatedAt required';
  return null;
}
```

### Helpers

```typescript
function groupEntities(flat: Entity[]): Record<string, Record<string, Entity>> {
  const grouped: Record<string, Record<string, Entity>> = {};
  for (const e of flat) {
    if (!grouped[e.entityType]) grouped[e.entityType] = {};
    grouped[e.entityType][e.clientId] = e;
  }
  return grouped;
}

function flattenEntities(grouped: Record<string, Record<string, Entity>>): Entity[] {
  const flat: Entity[] = [];
  for (const g of Object.values(grouped))
    for (const e of Object.values(g)) flat.push(e);
  return flat;
}

// Single revision — used by Option A endpoints and external system endpoints.
async function allocateRevision(session: any, userId: string): Promise<number> {
  const opts: any = { upsert: true, returnDocument: 'after' };
  if (session) opts.session = session;
  const result = await db.collection('sync_meta').findOneAndUpdate(
    { userId }, { $inc: { revision: 1 } }, opts);
  return result.revision;
}

// Batch revision — used by Option B sync endpoint.
// One Mongo round trip. Returns the first revision in the allocated block.
// Caller assigns rev, rev+1, rev+2, ... to each entity.
async function allocateRevisions(
  session: any, userId: string, count: number
): Promise<number> {
  if (count <= 0) return 0;
  const opts: any = { upsert: true, returnDocument: 'after' };
  if (session) opts.session = session;
  const result = await db.collection('sync_meta').findOneAndUpdate(
    { userId }, { $inc: { revision: count } }, opts);
  return result.revision - count + 1;  // first revision in the block
}

async function cascadeDelete(
  session: any, userId: string, parentId: string, depth = 0
): Promise<void> {
  if (depth > 5) return;
  // NOTE: This loads all non-deleted entities for the user and filters
  // in memory. Fine for <200 entities. If an app has users with 200+
  // entities and uses parent-child relationships, add an index:
  //   db.sync_entities.createIndex({ userId: 1, "refs.$**": 1 })
  // or flatten refs into a top-level parentClientId field and index that.
  const all = await db.collection('sync_entities')
    .find({ userId, deletedAt: null }, session ? { session } : {}).toArray();
  const toDelete = all.filter(c => Object.values(c.refs || {}).includes(parentId));
  if (!toDelete.length) return;
  const ids = toDelete.map(c => c.clientId);
  await db.collection('sync_entities').updateMany(
    { userId, clientId: { $in: ids } },
    { $set: { deletedAt: new Date().toISOString() } },
    session ? { session } : {}
  );
  for (const id of ids) await cascadeDelete(session, userId, id, depth + 1);
}
```

### Mongo

```javascript
db.sync_entities.createIndex({ userId: 1, clientId: 1 }, { unique: true });
db.sync_entities.createIndex({ userId: 1, revision: 1 });
db.sync_entities.createIndex({ userId: 1, entityType: 1, deletedAt: 1 });
db.sync_meta.createIndex({ userId: 1 }, { unique: true });
```

### External Systems

Any feature endpoint that produces entities follows one pattern:

```typescript
router.post('/api/some-feature', authenticate, async (req, res) => {
  const { userId } = req.user;
  // ... feature logic produces entity data ...
  const rev = await allocateRevision(null, userId);
  const entity = { ...result, userId, revision: rev };
  await db.collection('sync_entities').insertOne(entity);
  res.json(entity); // FE calls store.ingest(entity)
});
```

Persist before returning. FE ingests. No sync involvement.

---

---

# OPTION A — Basic Sync

Each mutation saves to the server immediately. Simple, fast, good
multi-device support via field-level merge.

**Use when:** Shipping fast. Users are online. App is a POC or doesn't
need offline support.

### Data Flow

```
User action → store.update() → debounce 1s → PATCH /entity → MongoDB $set → done
App opens   → GET /state → load into store → done
Tab focus   → GET /state → reload (picks up other device changes)
```

No queue. No batch. No conflict detection. MongoDB `$set` merges
fields from different devices automatically.

### Conflict Resolution

```
Device A: PATCH { data: { streak: 5 } }
Device B: PATCH { data: { lastCompletedAt: "2026-02-25" } }

MongoDB applies both. Result: { streak: 5, lastCompletedAt: "2026-02-25" }
Field-level merge — free.

Same field from two devices: last write wins at field level.
```

### Endpoints

```
GET    /api/state                  (shared)
PUT    /api/entities/:clientId     Create or full replace
PATCH  /api/entities/:clientId     Partial update
DELETE /api/entities/:clientId     Soft delete + cascade
```

### FE Store

```typescript
class BasicStore extends Store {
  private baseUrl = '/api/entities';
  private pendingSaves = new Map<string, ReturnType<typeof setTimeout>>();
  private saveDebounceMs = 1000;

  onSaveFailed?: (clientId: string, error: Error) => void;

  protected onMutate(clientId: string, entity: Entity, patch?: Partial<Entity>): void {
    const existing = this.pendingSaves.get(clientId);
    if (existing) clearTimeout(existing);
    this.pendingSaves.set(clientId, setTimeout(() => {
      this.pendingSaves.delete(clientId);
      this.saveToServer(clientId, entity, patch);
    }, this.saveDebounceMs));
  }

  private async saveToServer(
    clientId: string, entity: Entity, patch?: Partial<Entity>
  ): Promise<void> {
    try {
      if (entity.deletedAt) {
        await this.request('DELETE', clientId);
      } else if (entity.revision === 0) {
        const res = await this.request('PUT', clientId, entity);
        entity.revision = (await res.json()).revision;
      } else if (patch) {
        const res = await this.request('PATCH', clientId, patch);
        entity.revision = (await res.json()).revision;
      } else {
        const res = await this.request('PUT', clientId, entity);
        entity.revision = (await res.json()).revision;
      }
    } catch (err) {
      try {
        const res = await this.request('PUT', clientId, entity);
        entity.revision = (await res.json()).revision;
      } catch (retryErr) {
        this.onSaveFailed?.(clientId, retryErr as Error);
      }
    }
  }

  private async request(method: string, clientId: string, body?: any): Promise<Response> {
    const res = await fetch(`${this.baseUrl}/${clientId}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return res;
  }

  async refresh(): Promise<void> {
    const res = await fetch('/api/state');
    const { entities } = await res.json();
    this.loadFromServer(entities);
  }

  async flush(): Promise<void> {
    for (const [clientId, timer] of this.pendingSaves) {
      clearTimeout(timer);
      const entity = this.one(clientId) || this.get(clientId);
      if (entity) await this.saveToServer(clientId, entity);
    }
    this.pendingSaves.clear();
  }
}
```

### FE Init

```typescript
async function initBasic(store: BasicStore) {
  const res = await fetch('/api/state');
  const { entities } = await res.json();
  store.loadFromServer(entities);
  const onVisible = () => {
    if (document.visibilityState === 'visible') store.refresh();
  };
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('beforeunload', () => store.flush());
  return () => document.removeEventListener('visibilitychange', onVisible);
}
```

### BE Endpoints

```typescript
router.put('/api/entities/:clientId', authenticate, async (req, res) => {
  const { userId } = req.user;
  const { clientId } = req.params;
  const entity = req.body;
  entity.userId = userId;
  entity.clientId = clientId;
  const err = validateEntityEnvelope(entity);
  if (err) return res.status(400).json({ error: err });
  const rev = await allocateRevision(null, userId);
  entity.revision = rev;
  await db.collection('sync_entities').replaceOne(
    { userId, clientId }, entity, { upsert: true }
  );
  res.json({ clientId, revision: rev });
});

router.patch('/api/entities/:clientId', authenticate, async (req, res) => {
  const { userId } = req.user;
  const { clientId } = req.params;
  const patch = req.body;
  const updates: Record<string, any> = {};
  for (const [topKey, value] of Object.entries(patch)) {
    if (['data', 'refs'].includes(topKey) && typeof value === 'object' && value !== null) {
      for (const [subKey, subVal] of Object.entries(value as Record<string, any>)) {
        updates[`${topKey}.${subKey}`] = subVal;
      }
    } else {
      updates[topKey] = value;
    }
  }
  const rev = await allocateRevision(null, userId);
  updates.revision = rev;
  updates.updatedAt = new Date().toISOString();
  updates.userId = userId;
  const result = await db.collection('sync_entities').updateOne(
    { userId, clientId }, { $set: updates }
  );
  if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ clientId, revision: rev });
});

router.delete('/api/entities/:clientId', authenticate, async (req, res) => {
  const { userId } = req.user;
  const { clientId } = req.params;
  const now = new Date().toISOString();
  const rev = await allocateRevision(null, userId);
  const result = await db.collection('sync_entities').updateOne(
    { userId, clientId },
    { $set: { deletedAt: now, updatedAt: now, revision: rev } }
  );
  if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
  await cascadeDelete(null, userId, clientId);
  res.json({ clientId, deleted: true });
});
```

### Edge Cases

```
Save succeeds                    → revision bumped ✓
Save fails                       → one retry with PUT ✓
Save fails twice                 → onSaveFailed callback ✓
App closed with pending saves    → flush on beforeunload ✓
App crashes with pending saves   → lost, reload from server next open ✓
Two devices, different fields    → PATCH $set merges both ✓
Two devices, same field          → last write wins (field level) ✓
Delete with children             → server cascades ✓
External entity (ingest)         → already persisted, not dirty ✓
```

### Limitations

```
No offline support        Saves fail without network. User sees error.
No batched writes         Each mutation = 1 HTTP request (debounced).
Full reload on refresh    No incremental delta. Fine for <2000 entities.
```

### Rules

```
1. Every mutation through store.create / update / delete.
2. Store auto-saves (debounced). No manual sync calls.
3. External content → store.ingest(). Already persisted.
4. Children use refs. Query with store.byRef().
5. Deletes are soft with cascade.
6. App open → store.loadFromServer(). Server is truth.
7. Tab focus → store.refresh(). Picks up other devices.
8. If save fails → onSaveFailed callback. App decides UX.
```

---

---

# OPTION B — Full Sync

Mutations queue in a dirty set. A sync client batches them into a single
request. Server accepts or rejects each entity. Response includes a delta
of everything the client missed. Works offline.

**Use when:** The app needs offline support, batched writes under high
mutation frequency, or provable zero data loss during sync.

### Data Flow

```
User action → store.update() → localSeq++ → dirtySet.add(id)
           → auto scheduleSync() (2s debounce)
           → buildPayload() (snapshot current seqs, clone dirty entities)
           → POST /sync (one request, all dirty entities)
           → server: for each entity
               revision 0, not stored    → INSERT (new)
               revision === stored       → UPDATE (accept)
               revision !== stored       → REJECT (stale)
           → response: accepted[], rejected[], delta entities
           → applyResponse()
               for each entity in response:
                 localSeq > snapshot?  → keep local, take revision only
                 localSeq == snapshot? → accept server version
           → clean dirtySet
```

### Conflict Resolution

```
Single device:  Always accepted. No conflicts.
Multi-device:   Entity-level last-writer-wins.
                If Device A and B edit the same entity between syncs,
                whichever syncs second gets REJECTED. The delta in the
                response contains the server's version — client self-corrects.

                This is per-entity, NOT per-field. If A updates data.streak
                and B updates data.lastCompletedAt on the same entity,
                the later sync overwrites the earlier one entirely.

                If two fields need independent updates from multiple
                sources, put them in separate entities.
```

### Endpoints

```
GET    /api/state        (shared)
POST   /api/sync         Push dirty, receive delta
```

### Sync Wire Format

```typescript
// Request
interface SyncRequest {
  syncId: string;
  clientRevision: number;
  entities: EntityMap;
}

// Response
interface SyncResponse {
  syncId: string;
  serverRevision: number;
  entities: EntityMap;       // delta since clientRevision
  accepted: string[];
  rejected: { clientId: string; serverRevision: number; reason: string }[];
}
```

### FE Store

```typescript
class FullSyncStore extends Store {
  private localSeq = new Map<string, number>();
  private dirtySet = new Set<string>();
  private pendingSync: { syncId: string; seqs: Map<string, number> } | null = null;
  private serverRevision = 0;
  private scheduleFn?: () => void;

  // Register the sync scheduler. Called once during init.
  // Store calls this automatically on every mutation — apps can't forget.
  setScheduler(fn: () => void): void {
    this.scheduleFn = fn;
  }

  protected onMutate(clientId: string): void {
    this.localSeq.set(clientId, (this.localSeq.get(clientId) ?? 0) + 1);
    this.dirtySet.add(clientId);
    this.scheduleFn?.();
  }

  protected onLoadReset(): void {
    this.localSeq.clear();
    this.dirtySet.clear();
    this.pendingSync = null;
    this.serverRevision = 0;
  }

  buildPayload(): SyncRequest | null {
    if (this.dirtySet.size === 0) return null;
    const seqs = new Map<string, number>();
    const entities: Record<string, Record<string, Entity>> = {};
    for (const clientId of this.dirtySet) {
      const entity = this.get(clientId);
      if (entity) {
        if (!entities[entity.entityType]) entities[entity.entityType] = {};
        entities[entity.entityType][clientId] = structuredClone(entity);
        seqs.set(clientId, this.localSeq.get(clientId) ?? 0);
      }
    }
    const syncId = crypto.randomUUID();
    this.pendingSync = { syncId, seqs };
    return { syncId, clientRevision: this.serverRevision, entities };
  }

  // Fire-and-forget for beforeunload. Does NOT touch pendingSync or dirtySet.
  getDirtySnapshot(): SyncRequest | null {
    if (this.dirtySet.size === 0) return null;
    const entities: Record<string, Record<string, Entity>> = {};
    for (const clientId of this.dirtySet) {
      const entity = this.get(clientId);
      if (entity) {
        if (!entities[entity.entityType]) entities[entity.entityType] = {};
        entities[entity.entityType][clientId] = structuredClone(entity);
      }
    }
    return { syncId: crypto.randomUUID(), clientRevision: this.serverRevision, entities };
  }

  applyResponse(response: SyncResponse): void {
    if (!this.pendingSync || response.syncId !== this.pendingSync.syncId) return;
    const snapshot = this.pendingSync.seqs;

    for (const entitiesOfType of Object.values(response.entities)) {
      for (const serverEntity of Object.values(entitiesOfType)) {
        const id = serverEntity.clientId;
        const snapshotSeq = snapshot.get(id);
        const currentSeq = this.localSeq.get(id) ?? 0;
        if (snapshotSeq !== undefined && currentSeq > snapshotSeq) {
          const local = this.get(id);
          if (local) local.revision = serverEntity.revision;
        } else {
          this.set(serverEntity);
        }
      }
    }

    for (const clientId of [...this.dirtySet]) {
      const snapshotSeq = snapshot.get(clientId);
      const currentSeq = this.localSeq.get(clientId) ?? 0;
      if (snapshotSeq !== undefined && currentSeq === snapshotSeq) {
        this.dirtySet.delete(clientId);
      }
    }

    this.serverRevision = response.serverRevision;
    this.pendingSync = null;
  }

  loadFromServer(
    entities: Record<string, Record<string, Entity>>, serverRevision?: number
  ): void {
    super.loadFromServer(entities);
    if (serverRevision !== undefined) this.serverRevision = serverRevision;
  }

  hasPendingChanges(): boolean { return this.dirtySet.size > 0; }
  getDirtyCount(): number { return this.dirtySet.size; }
}
```

### FE Network Client

```typescript
class SyncClient {
  private store: FullSyncStore;
  private inFlight = false;
  private retryCount = 0;

  onSyncSuccess?: (accepted: number, rejected: number) => void;
  onSyncFailed?: (retryCount: number, dirtyCount: number) => void;

  constructor(store: FullSyncStore) { this.store = store; }

  async sync(): Promise<void> {
    if (this.inFlight) return;
    const payload = this.store.buildPayload();
    if (!payload) return;
    this.inFlight = true;
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data: SyncResponse = await res.json();
      this.store.applyResponse(data);
      this.retryCount = 0;
      this.onSyncSuccess?.(data.accepted.length, data.rejected.length);
    } catch {
      this.retryCount++;
      if (this.retryCount <= 3) {
        setTimeout(() => this.sync(), Math.min(1000 * 2 ** this.retryCount, 30000));
      } else {
        this.onSyncFailed?.(this.retryCount, this.store.getDirtyCount());
        this.retryCount = 0;
      }
    } finally {
      this.inFlight = false;
    }
  }

  start(): () => void {
    const timer = setInterval(() => this.sync(), 30_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') this.sync();
    };
    const onOnline = () => this.sync();
    const onUnload = () => {
      if (this.store.hasPendingChanges()) {
        const snapshot = this.store.getDirtySnapshot();
        if (snapshot) navigator.sendBeacon('/api/sync', JSON.stringify(snapshot));
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('beforeunload', onUnload);
    };
  }

  scheduleSync = debounce(() => this.sync(), 2000);
}

function debounce(fn: () => void, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return () => { clearTimeout(t); t = setTimeout(fn, ms); };
}
```

### FE Init

```typescript
async function initFullSync(store: FullSyncStore, syncClient: SyncClient) {
  const res = await fetch('/api/state');
  const { entities, serverRevision } = await res.json();
  store.loadFromServer(entities, serverRevision);

  // Store auto-schedules sync on every mutation. Apps can't forget.
  store.setScheduler(() => syncClient.scheduleSync());

  syncClient.onSyncFailed = (retries, dirtyCount) => {
    showBanner(`Sync failed. ${dirtyCount} changes pending.`);
  };

  return syncClient.start();
}
```

### BE Sync Endpoint

```typescript
function validateSyncRequest(body: any): string | null {
  if (typeof body.syncId !== 'string') return 'syncId required';
  if (typeof body.clientRevision !== 'number') return 'clientRevision required';
  if (typeof body.entities !== 'object' || body.entities === null) return 'entities required';
  for (const [type, group] of Object.entries(body.entities)) {
    if (typeof group !== 'object') return `entities.${type} must be object`;
    for (const [id, entity] of Object.entries(group as Record<string, any>)) {
      const err = validateEntityEnvelope(entity);
      if (err) return `${type}/${id}: ${err}`;
    }
  }
  return null;
}

router.post('/api/sync', authenticate, async (req, res) => {
  const validationError = validateSyncRequest(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { userId } = req.user;
  const { syncId, clientRevision, entities: incoming } = req.body;
  const flat = flattenEntities(incoming);

  for (const entity of flat) entity.userId = userId;
  if (flat.length > 500) return res.status(400).json({ error: 'Too many entities (max 500)' });

  const session = client.startSession();
  session.startTransaction();

  try {
    const accepted: string[] = [];
    const rejected: any[] = [];
    const entitiesToDelete: string[] = [];

    // 1. Fetch all existing in one query
    const clientIds = flat.map(e => e.clientId);
    const existing = await db.collection('sync_entities')
      .find({ userId, clientId: { $in: clientIds } }, { session }).toArray();
    const existingMap = new Map(existing.map(e => [e.clientId, e]));

    // 2. Classify each entity: new, update, or stale
    const toWrite: { entity: any; isInsert: boolean }[] = [];

    for (const entity of flat) {
      const stored = existingMap.get(entity.clientId);

      if (!stored && entity.revision === 0) {
        toWrite.push({ entity, isInsert: true });
        accepted.push(entity.clientId);

      } else if (stored && entity.revision === stored.revision) {
        toWrite.push({ entity, isInsert: false });
        accepted.push(entity.clientId);
        if (entity.deletedAt && !stored.deletedAt) {
          entitiesToDelete.push(entity.clientId);
        }

      } else {
        rejected.push({
          clientId: entity.clientId,
          serverRevision: stored?.revision ?? 0,
          reason: stored
            ? `Stale: client=${entity.revision}, server=${stored.revision}`
            : 'Unknown entity with revision > 0',
        });
      }
    }

    // 3. Allocate all revisions in one call
    let rev = 0;
    if (toWrite.length > 0) {
      rev = await allocateRevisions(session, userId, toWrite.length);
    }

    // 4. Build bulk operations
    const ops: any[] = [];
    for (const { entity, isInsert } of toWrite) {
      const assignedRev = rev++;
      if (isInsert) {
        ops.push({
          insertOne: { document: { ...entity, revision: assignedRev } }
        });
      } else {
        ops.push({
          updateOne: {
            filter: { userId, clientId: entity.clientId },
            update: { $set: { ...entity, revision: assignedRev } },
          }
        });
      }
    }

    // 5. Execute all writes in one call
    if (ops.length > 0) {
      await db.collection('sync_entities').bulkWrite(ops, { session, ordered: true });
    }

    // 6. Cascade deletes
    for (const id of entitiesToDelete) {
      await cascadeDelete(session, userId, id);
    }

    // 7. Fetch delta
    const delta = await db.collection('sync_entities')
      .find({ userId, revision: { $gt: clientRevision } }, { session })
      .sort({ revision: 1 }).toArray();
    const meta = await db.collection('sync_meta').findOne({ userId }, { session });

    await session.commitTransaction();
    res.json({
      syncId, serverRevision: meta?.revision ?? 0,
      entities: groupEntities(delta), accepted, rejected,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Sync failed' });
  } finally {
    session.endSession();
  }
});
```

### Edge Cases

```
Normal sync                  → cur === snap → accept server ✓
Mutation during flight       → cur > snap → keep local, take revision ✓
New entity during flight     → not in snapshot → stays dirty ✓
Delete during flight         → cur > snap → keep delete ✓
Sync fails                   → dirtySet unchanged → retry ✓
Sync fails 3x               → onSyncFailed → app decides UX ✓
Stale response (old syncId)  → ignored ✓
Rapid sync attempts          → inFlight guard ✓
App backgrounded             → getDirtySnapshot (no pendingSync mutation) ✓
Ingest during flight         → not in dirtySet → no conflict ✓
Rejection                    → server version in delta → self-corrects ✓
Other device changes         → not in snapshot → accept fully ✓
Malicious userId             → server overrides ✓
Bad entity shape             → envelope validation → 400 ✓
```

### Limitations

```
Full entity per sync           No partial updates. Sends entire entity
                               even if only one field changed.
Per-entity conflict            Not per-field. Two devices editing different
                               fields of same entity — one wins entirely.
sendBeacon is best-effort      Recovery is loadFromServer on next open.
```

### Rules

```
1. Every mutation through store.create / update / delete.
2. Store auto-schedules sync on every mutation. No manual calls needed.
3. External content → store.ingest(). Already persisted. Not dirty.
4. Children use refs. Query with store.byRef().
5. Deletes are soft with cascade.
6. App open → store.loadFromServer(). Only time server is truth.
7. Never read localSeq / dirtySet directly. Use hasPendingChanges().
8. Trust sync. Accepted = saved. Rejected = self-corrects via delta.
9. Conflict is per-entity. Split independent fields into separate entities.
```

---

---

# App Integration

Both options expose the same Store interface. App logic is identical.
No callbacks needed — each store handles its own sync internally.

```typescript
class MyAppStore {
  constructor(private store: Store) {}

  getItems(): MyItem[] { return this.store.byType('item') as MyItem[]; }

  addItem(data: MyItemData, userId: string): string {
    return this.store.create('item', { data }, userId);
  }

  updateItem(id: string, patch: Partial<MyItemData>, userId: string): void {
    this.store.update(id, { data: patch }, userId);
  }

  deleteItem(id: string, userId: string): void {
    this.store.delete(id, userId);
  }

  ingestFromExternal(entity: Entity): void {
    this.store.ingest(entity);
  }
}

// Option A — store auto-saves via debounced PUT/PATCH
const store = new BasicStore();
const app = new MyAppStore(store);
await initBasic(store);

// Option B — store auto-schedules sync via setScheduler
const store = new FullSyncStore();
const syncClient = new SyncClient(store);
const app = new MyAppStore(store);
await initFullSync(store, syncClient);
```

---

# Migration (A → B)

If an app's needs change, migration is mechanical:

```
1. Replace BasicStore → FullSyncStore
2. Add SyncClient
3. Replace initBasic → initFullSync
4. Add POST /api/sync endpoint
5. Optionally remove PUT/PATCH/DELETE routes
```

Entity shape, database, wire format, app store logic, typed interfaces,
and validation are unchanged.

**What you trade:** Field-level merge (A) for offline support (B).
Partial updates (A) for batched writes (B). Simplicity (A) for
durability guarantees (B).

---

# Risks

```
RISK                               WHAT HAPPENS                     MITIGATION
─────────────────────────────────  ──────────────────────────────   ─────────────────────────

Option B: entity-level conflict    Two devices edit different        By design. If fields need
                                   fields of same entity — one      independent updates, use
                                   device's changes are lost.       separate entities. Or
                                                                    stay on Option A.

Option A: no offline               Network drops → saves fail →     Acceptable for POCs. Add
                                   changes lost on next reload.     onSaveFailed for UX feedback.
                                                                    Migrate to B if needed.

Shallow merge of data: {}          { data: { tags: ['new'] } }      Document for app devs:
                                   replaces tags array, doesn't     spread nested fields
                                   append.                          manually. Avoid deep nesting.

Revision counter hotspot           All writes for one user go       Fine for <100 writes/sec/user.
                                   through one sync_meta doc.       Batch allocation (v7.1)
                                   Option B mitigated by batch      reduces to 1 call per sync.
                                   allocation.                      Per-type counters if needed.

Cascade delete full scan           Loads all user entities to       Add ref index when any app
                                   find children. O(n) per user.    has users with 200+ entities.
                                                                    See note in cascadeDelete.

Soft deletes grow forever          Storage increases over time.     Add 30-day cleanup cron.
                                   Reads are filtered (deletedAt    Documented, not implemented.
                                   null) so queries stay fast.

No pagination on initial load      GET /state returns everything.   Fine for <2000 entities.
                                                                    Cursor-based pagination later.

Shared package versioning          Breaking change blocks all       Semver. Apps pin versions.
                                   apps until they update.          Breaking changes = major bump.

FE timestamps trusted (Option B)   Client with wrong clock sends    Not a correctness issue
                                   bad updatedAt. Server stores     (revisions handle ordering).
                                   as-is.                           Add server-side override if
                                                                    needed for analytics.
```

---

# Comparison

```
                            OPTION A (Basic)          OPTION B (Full Sync)
────────────────────────   ────────────────────────   ────────────────────────
Network                     PUT/PATCH/DELETE per       POST /sync batch
                            entity (debounced)
Conflict resolution         Field-level ($set)         Entity-level (LWW)
Offline                     No                         Yes
Partial updates             Yes (PATCH)                No (full entity)
Multi-device                Poll / SSE                 Delta sync
Mongo round trips/sync      1 per mutation             3 (fetch + alloc + bulk)
FE lines                    ~100                       ~300
BE lines                    ~80                        ~100
Edge cases                  10                         14
Ship time                   Hours                      Days
```