import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Lightbox } from '../components/Lightbox';
import { Colophon } from '../folio/Colophon';
import { useScrollCraft } from '../folio/useScrollCraft';
import { getProject, nextProject, plateById } from '../content/projects';
import type { Plate } from '../content/types';

export function Work() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const root = useRef<HTMLElement>(null);
  const [openPlate, setOpenPlate] = useState<Plate | null>(null);
  const closePlate = useMemo(() => () => setOpenPlate(null), []);
  useScrollCraft(root, slug);

  if (!project) return <Navigate to="/" replace />;

  const hero = plateById(project, project.hero);
  const sheets = project.plates.filter((plate) => plate.kind === 'sheet');
  const peak = sheets.length > 1 ? sheets[1] : sheets[0] ?? plateById(project, project.cover);
  const next = nextProject(project.slug);
  const nextCover = plateById(next, next.cover);

  return (
    <article className="folio-work" ref={root}>
      <section className="work-open" data-sc-act="flow" data-sc-travel>
        <div className="work-title" data-sc-in data-sc-stagger="40">
          <p>
            {project.number}
            <span aria-hidden="true"> · </span>
            {project.place}
          </p>
          <h1>{project.title}</h1>
          <p className="work-sub">{project.subtitle}</p>
          <dl>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Studio</dt>
              <dd>{project.studio}</dd>
            </div>
            <div>
              <dt>Authorship</dt>
              <dd>{project.authorship}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
          </dl>
        </div>
        <figure className="work-hero">
          <div className="work-hero-frame">
            <img
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <figcaption>{hero.caption}</figcaption>
        </figure>
      </section>

      {project.chapters.map((chapter, index) => (
        <section className="chapter" id={chapter.id} key={chapter.id} data-sc-act="flow" data-sc-travel>
          <div className={index % 2 ? 'chapter-grid is-flip' : 'chapter-grid'}>
            <div className="chapter-copy" data-sc-in data-sc-stagger="50">
              <h2>{chapter.title}</h2>
              {chapter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="chapter-plates">
              {chapter.plates.map((id, plateIndex) => {
                const plate = plateById(project, id);
                const depth = plateIndex % 2 ? '0.55' : '-0.7';
                return (
                  <button key={id} type="button" className="plate-open" onClick={() => setOpenPlate(plate)}>
                    <figure data-sc-parallax={depth}>
                      <div className="plate-crop">
                        <img
                          src={plate.src}
                          alt={plate.alt}
                          width={plate.width}
                          height={plate.height}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <figcaption>{plate.caption}</figcaption>
                    </figure>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {project.video ? (
        <section className="film" data-sc-act="flow" data-sc-travel aria-labelledby="film-title">
          <div className="film-copy" data-sc-in>
            <h2 id="film-title">Project film</h2>
            <p>{project.video.caption} It stays paused until you start it.</p>
          </div>
          <div className="film-frame">
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
          </div>
        </section>
      ) : null}

      <section className="plate-pass" data-sc-act="pin" data-sc-span="2.1" aria-label={peak.caption}>
        <div className="plate-pass-stage" data-sc-stage>
          <div className="plate-pass-copy">
            <h2>{peak.caption}</h2>
            <button type="button" className="text-link" onClick={() => setOpenPlate(peak)}>
              Open the plate
            </button>
          </div>
          <div className="plate-pass-window">
            <img src={peak.src} alt={peak.alt} width={peak.width} height={peak.height} />
          </div>
        </div>
      </section>

      <section className="next-plate" data-sc-act="flow" data-sc-travel>
        <Link to={`/work/${next.slug}`} data-sc-in>
          <figure data-plate={next.slug}>
            <div className="next-crop">
              <img src={nextCover.src} alt="" width={nextCover.width} height={nextCover.height} loading="lazy" />
            </div>
            <figcaption>
              Next project
              <strong>{next.title}</strong>
              <span>{next.place}</span>
            </figcaption>
          </figure>
        </Link>
      </section>

      <Colophon />
      <Lightbox plate={openPlate} onClose={closePlate} />
    </article>
  );
}
