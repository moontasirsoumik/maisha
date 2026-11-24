import { horizon } from '../content/projects';
import { person } from '../content/site';

/** The ending every page shares: the address, set large enough to be the last thing seen. */
export function Close({ line = 'For a drawing, a review, or a collaboration.' }: { line?: string }) {
  return (
    <footer className="close" aria-labelledby="close-title">
      <div className="horizon" aria-hidden="true">
        <img
          src={horizon.src}
          alt=""
          width={horizon.width}
          height={horizon.height}
          loading="lazy"
          decoding="async"
          data-emerge
        />
      </div>
      <div className="container close-inner">
        <div className="close-copy" data-rise="group">
          <h2 id="close-title">Write to me</h2>
          <p>{line}</p>
        </div>
        <a className="close-mail" href={`mailto:${person.email}`} data-rise>
          {person.email}
        </a>
        <div className="close-foot">
          <p>{person.name}, {person.place}</p>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
