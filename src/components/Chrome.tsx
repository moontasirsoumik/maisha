import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { person } from '../content/site';

/** The top bar. It steps aside while the reader scrolls down and returns the moment they scroll up. */
export function Chrome() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setLifted(y > 8);
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  return (
    <header className="bar" data-hidden={hidden} data-lifted={lifted} onFocus={() => setHidden(false)}>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="bar-inner">
        <Link className="wordmark" to="/">
          {person.name}
        </Link>
        <nav aria-label="Primary">
          <ul>
            <li>
              <Link to="/#work" aria-current={pathname.startsWith('/work') ? 'page' : undefined}>
                Work
              </Link>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <a className="bar-write" href={`mailto:${person.email}`}>
                Write
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
