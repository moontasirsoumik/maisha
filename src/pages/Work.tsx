import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Lightbox } from '../components/Lightbox';
import { PLATE_KEY } from '../motion/transition';
import { PlateView } from '../components/PlateView';
import { getProject, nextProject, plateById } from '../content/projects';
import type { Plate } from '../content/types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Work() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const root = useRef<HTMLElement>(null);
  const [openPlate, setOpenPlate] = useState<Plate | null>(null);
  const closePlate = useMemo(() => () => setOpenPlate(null), []);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !project) return;

      const narrow = window.matchMedia('(max-width: 800px)').matches;
      const hero = root.current?.querySelector('.work-hero');
      if (hero) {
        gsap.fromTo(
          hero,
          { y: 0, rotationX: 0, scale: 1, z: 40 },
          {
            y: narrow ? '-6vh' : '-12vh',
            rotationX: narrow ? 6 : 12,
            scale: 0.92,
            z: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>('.chapter').forEach((chapter, index) => {
        const plate = chapter.querySelector('.chapter-plates');
        const side = index % 2 ? 1 : -1;
        const turn = narrow ? 7 : 12;
        if (plate) {
          gsap.fromTo(
            plate,
            { y: narrow ? '14vh' : '28vh', rotationY: side * turn, z: 160 },
            {
              y: narrow ? '-8vh' : '-12vh',
              rotationY: 0,
              z: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
              },
            },
          );
        }
      });

      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (project.slug !== 'cultural-roots' || !fine) return;
      const pin = root.current?.querySelector('.thesis-pin');
      const lines = root.current?.querySelectorAll('.thesis-line');
      if (!pin || !lines || window.matchMedia('(max-width: 800px)').matches) return;

      gsap.set(lines, { opacity: 0 });
      gsap.set(lines[0], { opacity: 1 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: '+=100vh',
          pin: true,
          scrub: true,
        },
      });
      timeline
        .to(lines[0], { opacity: 0, z: -80, duration: 0.3 }, 0.35)
        .to(lines[1], { opacity: 1, z: 0, duration: 0.3 }, 0.35)
        .to(lines[1], { opacity: 0, z: -80, duration: 0.3 }, 0.7)
        .to(lines[2], { opacity: 1, z: 0, duration: 0.3 }, 0.7);
    },
    { scope: root, dependencies: [slug], revertOnUpdate: true },
  );

  if (!project) return <Navigate to="/" replace />;

  const hero = plateById(project, project.hero);
  const following = nextProject(project.slug);
  const thesisLines = [
    'Elevated structures that follow the terrain.',
    'Bamboo, thatch, and timber from local practice.',
    'An open performance ground at the heart.',
  ];

  return (
    <article ref={root} className="work stage-3d">
      <header className="work-open">
        <figure
          className={hero.kind === 'sheet' ? 'work-hero is-sheet' : 'work-hero'}
          data-hero={project.slug}
          style={
            sessionStorage.getItem(PLATE_KEY) === project.slug
              ? { viewTransitionName: `plate-${project.slug}` }
              : undefined
          }
        >
          <img
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
        <div className="work-title">
          <p className="eyebrow">
            {project.number} · {project.authorship}
          </p>
          <h1>{project.title}</h1>
          <p>{project.subtitle}</p>
        </div>
      </header>

      <section className="work-meta" aria-label="Project details">
        <dl>
          <div>
            <dt>Place</dt>
            <dd>{project.place}</dd>
          </div>
          <div>
            <dt>Studio</dt>
            <dd>{project.studio}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
        <p className="work-lead">{project.lead}</p>
      </section>

      {project.slug === 'cultural-roots' ? (
        <section className="thesis-pin" aria-label="Three readings of the site">
          <p className="eyebrow">Three readings</p>
          <div className="thesis-lines">
            {thesisLines.map((line) => (
              <p key={line} className="thesis-line">
                {line}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {project.chapters.map((chapter) => (
        <section key={chapter.id} className="chapter" id={chapter.id}>
          <div className="chapter-copy">
            <p className="eyebrow">{chapter.eyebrow}</p>
            <h2>{chapter.title}</h2>
            {chapter.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={chapter.plates.length > 1 ? 'chapter-plates' : 'chapter-plates is-single'}>
            {chapter.plates.map((id) => (
              <PlateView key={id} plate={plateById(project, id)} onOpen={setOpenPlate} />
            ))}
          </div>
        </section>
      ))}

      {project.video ? (
        <section className="film" aria-labelledby="film-title">
          <div className="chapter-copy">
            <p className="eyebrow">Animation</p>
            <h2 id="film-title">Walking the spine.</h2>
            <p>The project film, compressed for the page. Press play. It starts muted.</p>
          </div>
          <video
            controls
            playsInline
            muted
            preload="none"
            poster={project.video.poster}
            width={project.video.width}
            height={project.video.height}
          >
            <source src={project.video.src} type="video/mp4" />
          </video>
          <p className="film-caption">{project.video.caption}</p>
        </section>
      ) : null}

      <nav className="next-work" aria-label="Next project">
        <p className="eyebrow">Next</p>
        <Link to={`/work/${following.slug}`}>
          <span>{following.number}</span>
          <strong>{following.title}</strong>
        </Link>
      </nav>
      <Lightbox plate={openPlate} onClose={closePlate} />
    </article>
  );
}
