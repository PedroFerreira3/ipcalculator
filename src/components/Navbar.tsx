import { useTranslation } from 'react-i18next'

import type { Theme } from '../hooks/useTheme'

interface NavbarProps {
  theme: Theme
  onToggleTheme: () => void
  onOpenHelp: () => void
}

const LANGUAGES = [
  { code: 'en',    label: 'EN' },
  { code: 'es',    label: 'ES' },
  { code: 'pt-BR', label: 'PT' },
]

function NetworkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <rect x="2" y="18" width="6" height="4" rx="1" />
      <rect x="16" y="18" width="6" height="4" rx="1" />
      <path d="M12 6v4M12 10H5v4M12 10h7v4" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="15" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="15" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="15" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export default function Navbar({ theme, onToggleTheme, onOpenHelp }: NavbarProps) {
  const { t, i18n } = useTranslation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="/">
          <span className="navbar-brand-icon"><NetworkIcon /></span>
          <span className="navbar-brand-name">IP Calculator</span>
          <span className="navbar-brand-badge">IPv4</span>
        </a>

        <div className="navbar-right">
          <div className="navbar-links">
            <a
              className="navbar-link"
              href="https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('navbar.cidrReference')}
            </a>
            <a
              className="navbar-link"
              href="https://en.wikipedia.org/wiki/Private_network"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('navbar.rfc1918')}
            </a>
          </div>

          <button
            aria-label={t('help.title')}
            className="theme-toggle-btn"
            title={t('help.title')}
            type="button"
            onClick={onOpenHelp}
          >
            <HelpIcon />
          </button>

          <button
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            type="button"
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="lang-switcher">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                aria-label={`Switch to ${lang.label}`}
                aria-pressed={i18n.language === lang.code}
                className={`lang-btn ${i18n.language === lang.code ? 'is-active' : ''}`}
                type="button"
                onClick={() => i18n.changeLanguage(lang.code)}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
