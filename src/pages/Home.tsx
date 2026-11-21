import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Colophon } from '../folio/Colophon';
import { useScrollCraft } from '../folio/useScrollCraft';
import { plateById, projects } from '../content/projects';
import { person } from '../content/site';

export function Home() {
  const root = useRef<HTMLElement>(null);
  useScrollCraft(root, 'home');

  const thesis = projects[0];
  const hero = plateById(thesis, thesis.hero);
  const lake = plateById(thesis, '09');
  const museum = plateById(thesis, '10');
  const peak = plateById(thesis, '06');

  return (
    <article ref={root} className="folio-home">
      <section className="title-page" data-sc-act="flow" data-sc-drift="#e7e2d8">
        <div className="title-lockup" data-sc-in>
          <h1>
            <span>Maisha</span>
            <span>Mahpara</span>
          </h1>
          <p className="title-line">{person.line}</p>
        </div>
        <p className="title-folio">
          <span>Folio</span>
          <span>Eight projects</span>
          <span>RUET, 2019–2025</span>
          <span>{person.place}</span>
        </p>
      </section>

      <section className="arrival" data-sc-act="flow" aria-labelledby="arrival-title">
        <div className="arrival-copy" data-sc-in data-sc-stagger="50">
          <h2 id="arrival-title">{thesis.title}</h2>
          <p className="arrival-place">{thesis.place}</p>
          <p>{thesis.lead}</p>
          <Link to={`/work/${thesis.slug}`}>View the thesis</Link>
        </div>
        <div className="arrival-stack">
          <img
            className="plane plane-back"
            data-sc-parallax="-1.15"
            src={lake.src}
            alt=""
            width={lake.width}
            height={lake.height}
          />
          <figure className="plane plane-mid" data-sc-parallax="-0.35">
            <img
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              {thesis.year}
              <span>Individual thesis</span>
            </figcaption>
          </figure>
          <img
            className="plane plane-front"
            data-sc-parallax="0.85"
            src={museum.src}
            alt=""
            width={museum.width}
            height={museum.height}
          />
        </div>
      </section>

      <section className="index-act" data-sc-act="pan" data-sc-span="4.2" data-sc-drift="#ddd6c8" aria-labelledby="index-title">
        <div data-sc-stage>
          <div className="index-rail" data-sc-pan="0.04">
            <div className="index-intro">
              <h2 id="index-title">Selected work</h2>
              <p>Eight projects, from Rangamati to Rajshahi. Open a plate to see the drawings.</p>
            </div>
            {projects.map((project) => {
              const cover = plateById(project, project.cover);
              return (
                <article className="index-plate" key={project.slug} data-sc-tilt="5">
                  <Link to={`/work/${project.slug}`}>
                    <figure data-plate={project.slug}>
                      <img
                        src={cover.src}
                        alt={cover.alt}
                        width={cover.width}
                        height={cover.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                    <div className="index-label">
                      <span>{project.number}</span>
                      <h3>{project.title}</h3>
                      <p>{project.place}</p>
                      <p>
                        {project.year}
                        <span aria-hidden="true"> · </span>
                        {project.authorship}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
            <div className="index-end">
              <p>Practice, training, and writing.</p>
              <Link to="/about">Record</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pass" data-sc-act="pin" data-sc-span="2.6" data-sc-drift="#d5ddd8" aria-labelledby="pass-title">
        <div className="pass-stage" data-sc-stage>
        <div className="pass-copy">
          <h2 id="pass-title">{thesis.title}</h2>
          <p>{thesis.place}. Board, lake view, masterplan.</p>
          <Link to={`/work/${thesis.slug}`}>View the thesis</Link>
        </div>
        <div className="pass-track">
          <figure className="pass-sheet">
            <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} />
            <figcaption>Opening board</figcaption>
          </figure>
          <figure className="pass-sheet">
            <img src={lake.src} alt={lake.alt} width={lake.width} height={lake.height} />
            <figcaption>Kaptai Lake</figcaption>
          </figure>
          <figure className="pass-sheet">
            <img src={peak.src} alt={peak.alt} width={peak.width} height={peak.height} />
            <figcaption>Masterplan</figcaption>
          </figure>
        </div>
        </div>
      </section>

      <Colophon />
    </article>
  );
}
