import { useEffect, useRef, type PointerEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Close } from '../components/Close';
import { CutFigure } from '../components/CutFigure';
import { bannerOf, hut, inkOf, objectOf, projects } from '../content/projects';
import { person } from '../content/site';
import { DESKTOP, MOTION, gsap, useGSAP, usePageMotion, usePageTop } from '../motion/motion';

const statement =
  'I design for places that already have a public life: hill settlements above Kaptai Lake, a campus plaza under old trees, a street that runs from the rail gate to the river.';

const now = [
  {
    title: 'Junior Architect',
    body: 'Shanghai HuaDu Architecture & Urban Design, Dhaka office.',
    when: 'Since May 2026',
  },
  {
    title: 'Research',
    body: 'A street-scale assessment of urban spines in Rajshahi, with Md. Asaduzzaman at RUET.',
    when: 'Since February 2026',
  },
  {
    title: 'Writing',
    body: 'The transformation of indigenous hill settlements in Rangamati, with Tamanna Sultana Swarna.',
    when: 'Manuscript in preparation',
  },
];

/** Leans the entry's object toward the cursor, −1 to 1 on each axis from the object's centre. */
function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const object = event.currentTarget.querySelector<HTMLElement>('.cut');
  if (!object) return;
  const box = object.getBoundingClientRect();
  const lean = (at: number, start: number, size: number) => Math.max(-1, Math.min(1, ((at - start) / size) * 2 - 1));
  object.style.setProperty('--mx', lean(event.clientX, box.left, box.width).toFixed(3));
  object.style.setProperty('--my', lean(event.clientY, box.top, box.height).toFixed(3));
}

function settle(event: PointerEvent<HTMLElement>) {
  const object = event.currentTarget.querySelector<HTMLElement>('.cut');
  object?.style.removeProperty('--mx');
  object?.style.removeProperty('--my');
}

export function Home() {
  const root = useRef<HTMLElement>(null);
  const location = useLocation();
  const thesis = projects[0];
  const print = bannerOf(thesis);
  const ghost = inkOf(thesis);

  usePageTop('home');
  useEffect(() => {
    document.title = 'Maisha Mahpara, Architect';
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const stage = root.current?.querySelector<HTMLElement>('[data-hero-stage]');
        const slot = root.current?.querySelector<HTMLElement>('[data-hero-slot]');
        const figure = root.current?.querySelector<HTMLElement>('[data-hero-print]');
        const copy = root.current?.querySelector<HTMLElement>('[data-hero-copy]');
        const image = figure?.querySelector('img');
        const caption = figure?.querySelector('figcaption');
        const ghost = stage?.querySelector<HTMLElement>('[data-hero-ghost]');
        if (!stage || !slot || !figure || !copy || !image || !caption) return;

        stage.dataset.mode = 'stage';
        const rest = () => {
          const s = stage.getBoundingClientRect();
          const f = slot.getBoundingClientRect();
          return `inset(${f.top - s.top}px ${s.right - f.right}px ${s.bottom - f.bottom}px ${f.left - s.left}px)`;
        };
        gsap.set(figure, { clipPath: rest() });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        if (ghost) tl.to(ghost, { yPercent: -10, scale: 1.06, duration: 1 }, 0);
        tl.fromTo(figure, { clipPath: () => rest() }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo(image, { scale: 1.16 }, { scale: 1, duration: 1, ease: 'power1.out' }, 0)
          .to(copy, { yPercent: -22, opacity: 0, duration: 0.55, ease: 'power1.in' }, 0)
          .fromTo(caption, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.72);

        return () => {
          delete stage.dataset.mode;
        };
      });

      mm.add(MOTION, () => {
        const lines = root.current?.querySelectorAll('[data-hero-copy] > *');
        if (lines?.length) {
          gsap.from(lines, { y: 32, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
        }
        gsap.from('[data-hero-ghost]', { opacity: 0, scale: 1.08, duration: 2.4, ease: 'expo.out' });

        const figure = root.current?.querySelector<HTMLElement>('[data-hut]');
        figure?.querySelectorAll<HTMLElement>('[data-lift]').forEach((layer) => {
          const lift = Number(layer.dataset.lift);
          gsap.fromTo(
            layer,
            { y: () => figure.offsetHeight * lift * 0.9 },
            {
              y: () => -figure.offsetHeight * lift,
              ease: 'none',
              scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom 30%', scrub: true, invalidateOnRefresh: true },
            },
          );
        });

        const words = root.current?.querySelectorAll('[data-fill] > span');
        if (words?.length) {
          gsap.fromTo(
            words,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.05,
              scrollTrigger: {
                trigger: root.current?.querySelector('[data-fill]'),
                start: 'top 78%',
                end: 'bottom 42%',
                scrub: true,
              },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  usePageMotion(root, 'home');

  useEffect(() => {
    if (location.hash !== '#work') return;
    const target = document.getElementById('work');
    if (!target) return;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [location.key, location.hash]);

  return (
    <article className="home" ref={root}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stage" data-hero-stage>
          <img
            className="hero-ghost"
            src={ghost.src}
            alt=""
            width={ghost.width}
            height={ghost.height}
            decoding="async"
            data-hero-ghost
          />
          <div className="container hero-grid">
            <div className="hero-copy" data-hero-copy>
              <h1 id="hero-title">
                <span>Maisha</span> <span>Mahpara</span>
              </h1>
              <p className="hero-line">{person.line}</p>
              <div className="hero-actions">
                <a className="btn" href="#work">
                  See the work
                </a>
                <a className="link" href={`mailto:${person.email}`}>
                  Write to me
                </a>
              </div>
            </div>
            <div className="hero-slot" data-hero-slot aria-hidden="true" />
            <figure className="hero-print" data-hero-print>
              <img
                src={print.src}
                alt={print.alt}
                width={print.width}
                height={print.height}
                fetchPriority="high"
              />
              <figcaption>
                <Link to={`/work/${thesis.slug}`}>{thesis.title}</Link>
                <span>
                  {thesis.place}, {thesis.year}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="work" className="index container" aria-labelledby="work-title">
        <header className="index-head" data-rise="group">
          <h2 id="work-title">Selected work</h2>
          <p>Eight projects, from the B.Arch thesis in Rangamati back through the design studios at RUET.</p>
        </header>
        <ol className="index-grid">
          {projects.map((project, i) => (
            <li className={`entry entry-${i + 1}`} key={project.slug}>
              <Link className="entry-link" to={`/work/${project.slug}`} onPointerMove={tilt} onPointerLeave={settle}>
                <CutFigure cut={objectOf(project)} className="entry-cut" eager={i < 2} />
                <div className="entry-meta">
                  <h3>{project.title}</h3>
                  <p>{project.place}</p>
                  <p className="muted">{project.subtitle}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="statement container" aria-label="Practice">
        <div className="statement-copy">
          <p className="statement-text" data-fill>
            {statement.split(' ').map((word, i) => (
              <span key={i}>{word} </span>
            ))}
          </p>
          <Link className="link" to="/about">
            About my practice
          </Link>
        </div>
        <figure className="hut" role="img" aria-label={hut.alt} style={{ aspectRatio: hut.ratio }} data-hut>
          {hut.layers.map((layer) => (
            <img
              key={layer.src}
              src={layer.src}
              alt=""
              loading="lazy"
              decoding="async"
              data-lift={layer.lift}
              style={{ left: `${layer.x * 100}%`, top: `${layer.y * 100}%`, width: `${layer.w * 100}%` }}
            />
          ))}
        </figure>
      </section>

      <section className="now container" aria-labelledby="now-title">
        <h2 id="now-title">Currently</h2>
        <ul className="now-list" data-rise="group">
          {now.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <p className="muted">{item.when}</p>
            </li>
          ))}
        </ul>
      </section>

      <Close />
    </article>
  );
}
