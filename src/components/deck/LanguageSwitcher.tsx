'use client';

import { useLang } from '@/lib/lang';

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 font-body text-sm">
      <button
        className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
          lang === 'en'
            ? 'text-deck-primary font-medium'
            : 'text-deck-disabled hover:text-deck-secondary'
        }`}
        onClick={() => setLang('en')}
        aria-label="English"
      >
        EN
      </button>
      <span className="text-deck-track">/</span>
      <button
        className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${
          lang === 'zh'
            ? 'text-deck-primary font-medium'
            : 'text-deck-disabled hover:text-deck-secondary'
        }`}
        onClick={() => setLang('zh')}
        aria-label="中文"
      >
        中文
      </button>
    </div>
  );
}
