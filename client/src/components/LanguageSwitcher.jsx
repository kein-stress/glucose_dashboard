import { useEffect, useRef, useState } from 'react';

export function LanguageSwitcher({ locale, locales, labels, flags, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function handleSelect(code) {
    onChange(code);
    setOpen(false);
  }

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-switcher-current"
        title={labels[locale]}
        aria-label={labels[locale]}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {flags[locale]}
      </button>
      {open && (
        <ul className="lang-switcher-menu" role="listbox">
          {locales
            .filter((code) => code !== locale)
            .map((code) => (
              <li key={code}>
                <button
                  type="button"
                  className="lang-switcher-option"
                  title={labels[code]}
                  aria-label={labels[code]}
                  role="option"
                  onClick={() => handleSelect(code)}
                >
                  {flags[code]}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
