import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Nav } from './components/Nav';
import { PLATE_KEY, runTransition } from './motion/transition';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Work } from './pages/Work';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      event.preventDefault();
      event.stopPropagation();
      const next = `${url.pathname}${url.search}${url.hash}`;
      const plate = anchor.querySelector<HTMLElement>('[data-plate]');
      const slug = plate?.dataset.plate ?? '';
      if (slug && plate) {
        sessionStorage.setItem(PLATE_KEY, slug);
        plate.style.viewTransitionName = `plate-${slug}`;
      } else {
        sessionStorage.removeItem(PLATE_KEY);
      }
      const transition = runTransition(() => {
        flushSync(() => navigate(next));
      });
      const focusHeading = () => {
        const heading = document.querySelector('h1');
        if (!(heading instanceof HTMLElement)) return;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      };
      const finish = () => {
        sessionStorage.removeItem(PLATE_KEY);
        focusHeading();
      };
      if (transition) transition.finished.finally(finish);
      else finish();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Nav />
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work/:slug" element={<Work />} />
        </Routes>
      </main>
    </>
  );
}
