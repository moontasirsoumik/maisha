import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { projects } from '../content/projects';

const links = [
  { to: '/', label: 'Work', end: true },
  { to: '/about', label: 'About', end: false },
  { to: 'mailto:mahparamaisha0@gmail.com', label: 'Write', end: false },
];

export function FolioChrome() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="folio-bar">
        <NavLink to="/" className="folio-mark" end>
          Maisha Mahpara
        </NavLink>
        <nav className="folio-nav" aria-label="Primary">
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                {link.to.startsWith('mailto:') ? (
                  <a href={link.to}>{link.label}</a>
                ) : (
                  <NavLink to={link.to} end={link.end}>
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="folio-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="folio-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
        </button>
      </header>
      <div className={open ? 'folio-panel is-open' : 'folio-panel'} id="folio-panel" hidden={!open}>
        <ol>
          {projects.map((item) => (
            <li key={item.slug}>
              <NavLink to={`/work/${item.slug}`}>
                <span>{item.number}</span>
                <span>{item.title}</span>
                <span>{item.place}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/about">
              <span>09</span>
              <span>About</span>
              <span>Practice, training, writing</span>
            </NavLink>
          </li>
          <li>
            <a href="mailto:mahparamaisha0@gmail.com">
              <span>10</span>
              <span>Write</span>
              <span>mahparamaisha0@gmail.com</span>
            </a>
          </li>
        </ol>
      </div>
    </>
  );
}
