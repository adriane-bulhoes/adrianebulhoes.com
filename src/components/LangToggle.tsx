import { useState } from 'react';

/**
 * PT/EN language toggle. Visual-only for now — English content is out of scope
 * until a future spec (Constitution IV). The toggle is present and stateful so
 * the structure is ready; selecting EN does not yet change content.
 */
const LANGS = ['PT', 'EN'] as const;
type Lang = (typeof LANGS)[number];

export default function LangToggle() {
  const [active, setActive] = useState<Lang>('PT');

  return (
    <div className="lang-toggle">
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          className={lang === active ? 'active' : undefined}
          aria-pressed={lang === active}
          title={lang === 'EN' ? 'English — em breve' : 'Português'}
          onClick={() => setActive(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
