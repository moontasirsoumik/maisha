import { useEffect, useRef } from 'react';
import { Close } from '../components/Close';
import { ground } from '../content/projects';
import {
  activities,
  education,
  experience,
  interests,
  person,
  portrait,
  practice,
  publications,
  scores,
  tools,
  workshops,
} from '../content/site';
import { usePageMotion, usePageTop } from '../motion/motion';

export function About() {
  const root = useRef<HTMLElement>(null);
  usePageTop('about');
  useEffect(() => {
    document.title = `${person.name}, About`;
  }, []);
  usePageMotion(root, 'about');

  return (
    <article className="about" ref={root}>
      <header className="about-head container">
        <div className="about-copy" data-rise="group">
          <h1 id="about-title">{person.name}</h1>
          <p className="lead">Architectural designer in Dhaka. {person.school}, 2025.</p>
          {practice.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="about-links">
            <a className="btn" href={`mailto:${person.email}`}>
              Write to me
            </a>
            <a className="link" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
        <figure className="portrait" data-rise>
          <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" />
        </figure>
      </header>

      <div className="ground container" aria-hidden="true">
        <img src={ground.src} alt="" width={ground.width} height={ground.height} loading="lazy" decoding="async" data-slide />
      </div>

      <section className="record container" aria-labelledby="interests-title">
        <h2 id="interests-title">Interests</h2>
        <ul className="record-list" data-rise="group">
          {interests.map((item) => (
            <li key={item}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="record container" aria-labelledby="practice-title">
        <h2 id="practice-title">Practice</h2>
        <ol className="record-list">
          {experience.map((item) => (
            <li key={item.title} data-rise>
              <time>{item.when}</time>
              <div>
                <h3>{item.title}</h3>
                <p className="muted">{item.place}</p>
                <ul className="points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="record container" aria-labelledby="training-title">
        <h2 id="training-title">Training</h2>
        <ol className="record-list">
          {education.map((item) => (
            <li key={item.title} data-rise>
              <time>{item.when}</time>
              <div>
                <h3>{item.title}</h3>
                <p className="muted">{item.place}</p>
                <p>{item.note}</p>
              </div>
            </li>
          ))}
          {workshops.map((item) => (
            <li key={item.title} data-rise>
              <time>{item.when}</time>
              <div>
                <h3>{item.title}</h3>
                <p className="muted">{item.place}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="record container" aria-labelledby="writing-title">
        <h2 id="writing-title">Writing</h2>
        <ul className="record-list" data-rise="group">
          {publications.map((item) => (
            <li key={item}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="record container" aria-labelledby="tools-title">
        <h2 id="tools-title">Tools</h2>
        <dl className="record-list tools" data-rise="group">
          {tools.map((item) => (
            <div key={item.group}>
              <dt>{item.group}</dt>
              <dd>{item.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="record container" aria-labelledby="also-title">
        <h2 id="also-title">Also</h2>
        <ul className="record-list">
          {activities.map((item) => (
            <li key={item.title} data-rise>
              <time>{item.when}</time>
              <div>
                <h3>{item.title}</h3>
                <p className="muted">{item.place}</p>
              </div>
            </li>
          ))}
          {scores.map((item) => (
            <li key={item} data-rise>
              <time>2026</time>
              <div>
                <h3>Language</h3>
                <p className="muted">{item}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Close />
    </article>
  );
}
