import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Colophon } from '../folio/Colophon';
import { useScrollCraft } from '../folio/useScrollCraft';
import { projects } from '../content/projects';
import {
  activities,
  education,
  experience,
  interests,
  person,
  portrait,
  practice,
  publications,
  references,
  scores,
  tools,
  workshops,
} from '../content/site';

export function About() {
  const root = useRef<HTMLElement>(null);
  useScrollCraft(root, 'about');

  return (
    <article className="folio-about" ref={root}>
      <header className="record-open" data-sc-act="flow" data-sc-travel>
        <div data-sc-in data-sc-stagger="40">
          <h1>{person.name}</h1>
          <p className="record-focus">{person.focus}</p>
          <p className="record-meta">{person.place}</p>
        </div>
        <figure className="record-portrait">
          <div className="record-frame">
            <img
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </figure>
      </header>

      <section className="record-practice" data-sc-act="flow">
        <div className="record-measure" data-sc-in data-sc-stagger="40">
          {practice.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="record-block" data-sc-act="flow" aria-labelledby="interests-title">
        <h2 id="interests-title">Interests</h2>
        <ul data-sc-in data-sc-stagger="36">
          {interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="record-block" data-sc-act="flow" aria-labelledby="education-title">
        <h2 id="education-title">Training</h2>
        <ol className="record-facts" data-sc-in data-sc-stagger="40">
          {education.map((item) => (
            <li key={item.title}>
              <div className="fact-head">
                <h3>{item.title}</h3>
                <time>{item.when}</time>
              </div>
              <p className="fact-place">{item.place}</p>
              <p className="fact-note">{item.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="record-block" data-sc-act="flow" aria-labelledby="experience-title">
        <h2 id="experience-title">Practice and research</h2>
        <ol className="record-facts" data-sc-in data-sc-stagger="40">
          {experience.map((item) => (
            <li key={item.title}>
              <div className="fact-head">
                <h3>{item.title}</h3>
                <time>{item.when}</time>
              </div>
              <p className="fact-place">{item.place}</p>
              <ul className="fact-points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="record-split" data-sc-act="flow">
        <div>
          <h2>Writing</h2>
          <ul className="record-cites" data-sc-in data-sc-stagger="36">
            {publications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 id="skills-title">Drawing desk</h2>
          <ul className="record-tools" data-sc-in data-sc-stagger="28">
            {tools.map((tool) => (
              <li key={tool.group}>
                <span>{tool.group}</span>
                {tool.items}
              </li>
            ))}
          </ul>
          <p className="record-score">{scores[0]}</p>
        </div>
      </section>

      <section className="record-split" data-sc-act="flow">
        <div>
          <h2>Further study</h2>
          <ol className="record-facts" data-sc-in>
            {workshops.map((item) => (
              <li key={item.title}>
                <div className="fact-head">
                  <h3>{item.title}</h3>
                  <time>{item.when}</time>
                </div>
                <p className="fact-place">{item.place}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2>At RUET</h2>
          <ol className="record-facts" data-sc-in>
            {activities.map((item) => (
              <li key={item.title}>
                <div className="fact-head">
                  <h3>{item.title}</h3>
                  <time>{item.when}</time>
                </div>
                <p className="fact-place">{item.place}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="record-block" data-sc-act="flow" aria-labelledby="roles-title">
        <h2 id="roles-title">Projects</h2>
        <ol className="record-roles" data-sc-in data-sc-stagger="30">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link to={`/work/${project.slug}`}>
                <span className="role-num">{project.number}</span>
                <span className="role-copy">
                  <strong>{project.title}</strong>
                  <span>{project.role}</span>
                </span>
                <span className="role-auth">{project.authorship}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="record-block" data-sc-act="flow" aria-labelledby="references-title">
        <h2 id="references-title">References</h2>
        <ul className="record-refs" data-sc-in data-sc-stagger="40">
          {references.map((item) => (
            <li key={item.email}>
              <h3>{item.name}</h3>
              <p className="fact-place">{item.role}</p>
              <p className="fact-note">{item.place}</p>
              <a href={`mailto:${item.email}`}>{item.email}</a>
            </li>
          ))}
        </ul>
      </section>

      <Colophon />
    </article>
  );
}
