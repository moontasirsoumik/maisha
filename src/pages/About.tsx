import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Contact } from '../components/Contact';
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

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const narrow = window.matchMedia('(max-width: 800px)').matches;
      const portrait = root.current?.querySelector('.portrait');
      if (portrait) {
        gsap.fromTo(
          portrait,
          { y: narrow ? '4vh' : '8vh', rotationY: narrow ? -4 : -8, z: 80 },
          {
            y: 0,
            rotationY: 0,
            z: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: portrait,
              start: 'top bottom',
              end: 'center center',
              scrub: true,
            },
          },
        );
      }
      gsap.utils.toArray<HTMLElement>('.about-practice, .fact-list, .cite-list, .role-list, .ref-list').forEach((block) => {
        gsap.fromTo(
          block,
          { y: narrow ? '4vh' : '8vh', z: 40 },
          {
            y: 0,
            z: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: block,
              start: 'top bottom',
              end: 'center center',
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <article className="about stage-3d" ref={root}>
      <header className="about-hero">
        <div>
          <p className="eyebrow">{person.role}</p>
          <h1>{person.name}</h1>
          <p className="about-line">{person.focus}</p>
        </div>
        <figure className="portrait">
          <img
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </header>

      <section className="about-practice">
        {practice.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="about-block" aria-labelledby="interests-title">
        <p className="eyebrow">Research interests</p>
        <h2 id="interests-title">What the work follows</h2>
        <ul className="interest-list">
          {interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-block" aria-labelledby="education-title">
        <p className="eyebrow">Education</p>
        <h2 id="education-title">Training</h2>
        <ul className="fact-list">
          {education.map((item) => (
            <li key={item.title}>
              <div className="fact-head">
                <h3>{item.title}</h3>
                <time>{item.when}</time>
              </div>
              <p>{item.place}</p>
              <p className="fact-note">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-block" aria-labelledby="experience-title">
        <p className="eyebrow">Experience</p>
        <h2 id="experience-title">Practice and research</h2>
        <ul className="fact-list">
          {experience.map((item) => (
            <li key={item.title}>
              <div className="fact-head">
                <h3>{item.title}</h3>
                <time>{item.when}</time>
              </div>
              <p>{item.place}</p>
              <ul className="point-list">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-block" aria-labelledby="publications-title">
        <p className="eyebrow">Publications</p>
        <h2 id="publications-title">Writing</h2>
        <ul className="cite-list">
          {publications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-split" aria-labelledby="skills-title">
        <div>
          <p className="eyebrow">Workshops and courses</p>
          <h2>Further study</h2>
          <ul className="fact-list">
            {workshops.map((item) => (
              <li key={item.title}>
                <div className="fact-head">
                  <h3>{item.title}</h3>
                  <time>{item.when}</time>
                </div>
                <p className="fact-note">{item.place}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Skills</p>
          <h2 id="skills-title">Drawing desk</h2>
          <ul className="tool-list">
            {tools.map((tool) => (
              <li key={tool.group}>
                <span>{tool.group}</span>
                {tool.items}
              </li>
            ))}
          </ul>
          <p className="score-note">{scores[0]}</p>
        </div>
      </section>

      <section className="about-block" aria-labelledby="activities-title">
        <p className="eyebrow">Leadership</p>
        <h2 id="activities-title">At RUET</h2>
        <ul className="fact-list">
          {activities.map((item) => (
            <li key={item.title}>
              <div className="fact-head">
                <h3>{item.title}</h3>
                <time>{item.when}</time>
              </div>
              <p className="fact-note">{item.place}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="roles-title" className="about-block">
        <p className="eyebrow">Selected roles</p>
        <h2 id="roles-title">What I took on</h2>
        <ul className="role-list">
          {projects.map((project) => (
            <li key={project.slug}>
              <span>{project.number}</span>
              <div>
                <h3>{project.title}</h3>
                <p>{project.role}</p>
              </div>
              <em>{project.authorship}</em>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-block" aria-labelledby="references-title">
        <p className="eyebrow">References</p>
        <h2 id="references-title">Ask them</h2>
        <ul className="ref-list">
          {references.map((item) => (
            <li key={item.email}>
              <h3>{item.name}</h3>
              <p>{item.role}</p>
              <p className="fact-note">{item.place}</p>
              <a href={`mailto:${item.email}`}>{item.email}</a>
            </li>
          ))}
        </ul>
      </section>

      <Contact />
    </article>
  );
}
