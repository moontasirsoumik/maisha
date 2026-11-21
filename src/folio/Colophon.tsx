import { person } from '../content/site';

export function Colophon() {
  return (
    <section className="colophon" id="write" data-sc-act="flow">
      <div className="colophon-plate" data-sc-in data-sc-stagger="60">
        <h2>Write</h2>
        <p className="colophon-line">
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </p>
        <p className="colophon-meta">
          <a href={person.linkedin} rel="noopener noreferrer">
            LinkedIn
          </a>
          <span>{person.place}</span>
          <span>B.Arch, RUET, 2025</span>
        </p>
        <p className="colophon-note">
          Drawings by {person.name}. Open a plate for a sharper copy. The Rajshahi film stays paused until you start it.
        </p>
      </div>
    </section>
  );
}
