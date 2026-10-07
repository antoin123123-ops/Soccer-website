import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/scores', label: 'Scores' },
  { to: '/standings', label: 'Standings' },
  { to: '/teams', label: 'Teams' },
  { to: '/stats', label: 'Stats' },
  { to: '/news', label: 'News' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo__mark">⚽</span>
          <span className="logo__text">PSL</span>
        </Link>
        <button className="header__toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          ☰
        </button>
        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav__link" onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <a className="header__cta" href="#tickets" onClick={(e) => e.preventDefault()}>
          Tickets
        </a>
      </div>
    </header>
  );
}
