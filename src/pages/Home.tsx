import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Contact } from '../components/Contact';
import { plateById, projects } from '../content/projects';
import { person } from '../content/site';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Home() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const narrow = window.matchMedia('(max-width: 800px)').matches;
      if (reduce) return;

      const cover = root.current?.querySelector('.cover');
      const plate = root.current?.querySelector('.cover-hero');
      if (cover && plate && !narrow) {
        gsap.fromTo(
          plate,
          { scale: 1, yPercent: 0, rotationX: 0, z: 80 },
          {
            scale: 0.78,
            yPercent: -16,
            rotationX: 14,
            z: -220,
            ease: 'none',
            scrollTrigger: {
              trigger: cover,
              start: 'top top',
              end: '+=180%',
              pin: true,
              scrub: true,
              anticipatePin: 1,
            },
          },
        );
      } else if (plate) {
        gsap.fromTo(
          plate,
          { yPercent: 8, rotationX: 4, z: 40 },
          {
            yPercent: -10,
            rotationX: 0,
            z: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: plate,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>('.index-row').forEach((row, index) => {
        const card = row.querySelector('.index-plate');
        const copy = row.querySelector('.index-text');
        const side = index % 2 ? 1 : -1;
        const turn = narrow ? 7 : 14;
        if (card) {
          gsap.fromTo(
            card,
            { y: narrow ? '18vh' : '28vh', z: 180, rotationY: side * turn, scale: 1.06 },
            {
              y: 0,
              z: 0,
              rotationY: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }
        if (copy) {
          gsap.fromTo(
            copy,
            { y: narrow ? '6vh' : '12vh' },
            {
              y: narrow ? '-4vh' : '-8vh',
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      return () => window.removeEventListener('load', refresh);
    },
    { scope: root },
  );

  const hero = plateById(projects[0], projects[0].hero);

  return (
    <div ref={root}>
      <section className="cover stage-3d">
        <div className="cover-stage">
        <div className="cover-copy">
          <p className="eyebrow">{person.role}</p>
          <h1>
            <span>Maisha</span>
            <span>Mahpara</span>
          </h1>
          <p className="cover-line">{person.line}</p>
          <p className="cover-meta">
            <span>{person.place}</span>
            <span>Eight projects</span>
          </p>
        </div>
        <figure className="cover-hero">
          <img
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>
            <span>01</span>
            <span>{projects[0].title}</span>
            <span>{projects[0].place}</span>
          </figcaption>
        </figure>
        </div>
      </section>

      <div className="index-head">
        <p className="eyebrow">Selected work</p>
        <h2 id="index-title">The folio</h2>
      </div>
      <section className="index stage-3d" aria-labelledby="index-title">
        <ol className="index-list">
          {projects.map((project, index) => {
            const cover = plateById(project, project.cover);
            return (
              <li key={project.slug} className={index % 2 ? 'index-row is-offset' : 'index-row'}>
                <Link to={`/work/${project.slug}`} className="index-link">
                  <div className="index-text">
                    <p className="index-number">{project.number}</p>
                    <h3>{project.title}</h3>
                    <p className="index-sub">{project.subtitle}</p>
                    <p className="index-place">
                      {project.place}
                      <span aria-hidden="true"> · </span>
                      {project.authorship}
                    </p>
                  </div>
                  <figure className="index-plate" data-plate={project.slug}>
                    <img
                      src={cover.src}
                      alt=""
                      width={cover.width}
                      height={cover.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <Contact />
    </div>
  );
}
