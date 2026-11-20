import { person } from '../content/site';

export function Contact() {
  return (
    <section className="contact" id="contact">
      <p className="eyebrow">Contact</p>
      <h2>Write.</h2>
      <div className="contact-grid">
        <a className="contact-link" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <a href={person.linkedin} rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
      <p className="contact-place">{person.place}</p>
    </section>
  );
}
