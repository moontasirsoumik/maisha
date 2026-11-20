import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Index', end: true },
  { to: '/about', label: 'About', end: false },
  { to: '/#contact', label: 'Contact', end: false },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Primary">
        <NavLink to="/" className="nav-mark" end>
          Maisha Mahpara
        </NavLink>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.label}>
              {link.to.startsWith('/#') ? (
                <a href={link.to}>{link.label}</a>
              ) : (
                <NavLink to={link.to} end={link.end}>
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="nav-toggle-lines" aria-hidden="true" />
        </button>
      </nav>
      <div id="nav-panel" className="nav-panel" hidden={!open}>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              {link.to.startsWith('/#') ? (
                <a href={link.to} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ) : (
                <NavLink to={link.to} end={link.end} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
