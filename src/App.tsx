import { Route, Routes, useLocation } from 'react-router-dom';
import { Chrome } from './components/Chrome';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { WorkRoute } from './pages/Work';

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Chrome />
      <main id="content" className="page" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work/:slug" element={<WorkRoute />} />
        </Routes>
      </main>
    </>
  );
}
