import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Close } from '../components/Close';
import { CutFigure } from '../components/CutFigure';
import { Lightbox } from '../components/Lightbox';
import { SceneBanner } from '../components/SceneBanner';
import {
  bannerOf,
  cutOf,
  getProject,
  inkOf,
  loosePlates,
  nextProject,
  plateById,
  platesInOrder,
  printsOnPaper,
  sceneOf,
  thumbOf,
} from '../content/projects';
import type { Plate, Project } from '../content/types';
import { usePageMotion, usePageTop } from '../motion/motion';

export function WorkRoute() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  if (!project) return <Navigate to="/" replace />;
  return <Work project={project} key={project.slug} />;
}

function Work({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const onIndex = useCallback((index: number | null) => setOpen(index), []);
  const ordered = useMemo(() => platesInOrder(project), [project]);
  const loose = useMemo(() => loosePlates(project), [project]);
  const banner = bannerOf(project);
  const tall = banner.height > banner.width;
  const ghost = inkOf(project);
  const cut = cutOf(project);
  const scene = sceneOf(project);
  const next = nextProject(project.slug);
  const nextThumb = thumbOf(next);

  usePageTop(project.slug);
  useEffect(() => {
    document.title = `${project.title}, ${project.place}`;
    return () => {
      document.title = 'Maisha Mahpara, Architect';
    };
  }, [project.title, project.place]);
  usePageMotion(root, project.slug);

  const show = (plate: Plate) => setOpen(ordered.findIndex((item) => item.id === plate.id));

  return (
    <article className="case" ref={root}>
      <header className={tall ? 'case-head container case-head-tall' : 'case-head container'}>
        <img
          className={ghost.width / ghost.height > 2 ? 'case-ghost case-ghost-strip' : 'case-ghost'}
          src={ghost.src}
          alt=""
          width={ghost.width}
          height={ghost.height}
          decoding="async"
          data-ghost="22"
        />
        <div className="case-title" data-rise="group">
          <h1 id="case-title">{project.title}</h1>
          <p className="lead">{project.lead}</p>
        </div>
        <dl className="facts" data-rise="group">
          <div>
            <dt>Project</dt>
            <dd>{project.subtitle}</dd>
          </div>
          <div>
            <dt>Place</dt>
            <dd>{project.place}</dd>
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
            <dt>My part</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
        {tall && cut ? (
          <CutFigure cut={cut} className="case-cut" eager />
        ) : tall ? (
          <figure className="case-portrait" data-picture="flat">
            <img src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} fetchPriority="high" />
          </figure>
        ) : null}
      </header>

      {scene ? (
        <SceneBanner scene={scene} alt={banner.alt} />
      ) : tall ? null : (
        <figure className={printsOnPaper(project) ? 'case-banner entry-frame-print' : 'case-banner'} data-picture style={{ aspectRatio: `${banner.width} / ${banner.height}` }}>
          <img src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} fetchPriority="high" data-drift />
        </figure>
      )}

      {project.chapters.map((chapter) => (
        <section className="chapter container" key={chapter.id} aria-labelledby={`ch-${chapter.id}`}>
          <div className="chapter-text">
            <div className="chapter-sticky" data-rise="group">
              <h2 id={`ch-${chapter.id}`}>{chapter.title}</h2>
              {chapter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="chapter-plates">
            {chapter.plates.map((id) => (
              <PlateFigure plate={plateById(project, id)} onOpen={show} key={id} />
            ))}
          </div>
        </section>
      ))}

      {project.video ? (
        <section className="film container" aria-labelledby="film-title">
          <h2 id="film-title">The film</h2>
          <figure data-rise>
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
            <figcaption>{project.video.caption}</figcaption>
          </figure>
        </section>
      ) : null}

      {loose.length ? (
        <section className="more container" aria-labelledby="more-title">
          <h2 id="more-title">More drawings</h2>
          <div className="more-grid">
            {loose.map((plate) => (
              <PlateFigure plate={plate} onOpen={show} key={plate.id} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className="next container" aria-label="Next project">
        <Link className="next-link" to={`/work/${next.slug}`}>
          <span className="next-copy">
            <span className="muted">Next project</span>
            <strong>{next.title}</strong>
            <span>{next.place}</span>
          </span>
          <span className="next-frame" data-picture>
            <span className="zoom">
              <img src={nextThumb.src} alt="" width={nextThumb.width} height={nextThumb.height} loading="lazy" data-drift />
            </span>
          </span>
        </Link>
      </nav>

      <Close line="For the full drawing set, a review, or a collaboration." />
      <Lightbox plates={ordered} index={open} onIndex={onIndex} />
    </article>
  );
}

function PlateFigure({ plate, onOpen }: { plate: Plate; onOpen: (plate: Plate) => void }) {
  const sheet = plate.kind === 'sheet';
  return (
    <figure className="plate" data-kind={plate.kind}>
      <button type="button" className="plate-open" onClick={() => onOpen(plate)} aria-label={`Open ${plate.caption}`}>
        <span className="plate-frame" data-picture={sheet ? 'flat' : ''}>
          <img
            src={plate.src}
            alt={plate.alt}
            width={plate.width}
            height={plate.height}
            loading="lazy"
            decoding="async"
            data-drift={sheet ? undefined : ''}
          />
        </span>
      </button>
      <figcaption>{plate.caption}</figcaption>
    </figure>
  );
}
