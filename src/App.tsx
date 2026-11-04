import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import {
  contact,
  portrait,
  profile,
  projects,
  tools,
  type Project,
  type ProjectImage,
  type ProjectSection,
} from './content/projects';
import { useCinematicMotion } from './motion/useCinematicMotion';

function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return {
    hash,
    projectSlug: hash.match(/^#\/projects\/([^/?#]+)/)?.[1] ?? null,
    projectAnchor: hash.match(/^#\/projects\/[^/?#]+#(.+)$/)?.[1] ?? null,
    isAbout: hash === '#about' || /^#\/about(?:#|$)/.test(hash),
    aboutAnchor: hash.match(/^#\/about#(.+)$/)?.[1] ?? null,
  };
}

function Arrow({ direction = 'right' }: { direction?: 'right' | 'left' | 'up' | 'down' }) {
  const rotation = direction === 'down' ? 90 : direction === 'up' ? -90 : direction === 'left' ? 180 : 0;
  return (
    <span className="arrow-icon" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
      <svg viewBox="0 0 20 20" focusable="false">
        <path d="M2 10h15M11 4l6 6-6 6" />
      </svg>
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function ImageFrame({ image, className = '', priority = false, motionFrame, motionImage }: { image: ProjectImage; className?: string; priority?: boolean; motionFrame?: string; motionImage?: string }) {
  return (
    <figure className={`image-frame ${className}`} data-motion={motionFrame}>
      <div className="image-window">
        <img
          data-motion={motionImage}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ objectPosition: image.focalPoint ?? '50% 50%' }}
        />
        <span className="image-sheen" data-motion="image-sheen" aria-hidden="true" />
      </div>
      {image.caption && <figcaption className="image-caption">{image.caption}</figcaption>}
    </figure>
  );
}

function SiteHeader({ projectPage = false }: { projectPage?: boolean }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-logo" href="#/" aria-label="Maisha Mahpara home">Maisha Mahpara</Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {projectPage ? <Link href="#/">Back to portfolio</Link> : <>
            <Link href="#profile">Profile</Link>
            <Link href="#projects">Projects</Link>
            <Link href="#contact">Contact</Link>
          </>}
        </nav>
      </div>
    </header>
  );
}

function FolioCover() {
  return (
    <section className="folio-cover" data-motion="cover" aria-labelledby="cover-title">
      <div className="folio-cover__copy" data-motion="cover-copy">
        <div className="folio-cover__title" data-motion="cover-title"><Heading level={1} id="cover-title"><span>Maisha</span> <em>Mahpara</em></Heading></div>
        <Eyebrow>Architecture graduate portfolio</Eyebrow>
        <Text as="p" type="large">I begin with the place, the people, and the everyday life a project needs to hold.</Text>
        <Button className="folio-button" label="Open projects" href="#projects" variant="ghost" endContent={<Arrow />} />
      </div>
      <div className="folio-cover__plate" data-motion="cover-plate">
        <ImageFrame image={projects[0].hero} priority motionImage="cover-image" />
      </div>
      <div className="folio-cover__meta" data-motion="cover-meta">
        <span>Maisha Mahpara</span>
        <span>RUET / Architecture</span>
        <span>01 / 05 / Selected work</span>
      </div>
      <nav className="folio-cover__project-strip" data-motion="cover-strip" aria-label="Project index">
        {projects.map((project) => (
          <a href={`#/projects/${project.slug}`} key={project.slug}>
            <span>{project.number}</span>
            <strong>{project.title}</strong>
          </a>
        ))}
      </nav>
    </section>
  );
}

function ProjectPlate({ project, index }: { project: Project; index: number }) {
  return (
    <a className={`project-plate project-plate--${index + 1} project-plate--${project.visualMode}`} data-motion="project-plate" href={`#/projects/${project.slug}`}>
      <ImageFrame image={project.hero} motionImage="project-image" />
      <span className="project-plate__label">
        <span>{project.number} / {project.category}</span>
        <strong>{project.title}</strong>
        <small>{project.subtitle}</small>
      </span>
      <Arrow />
    </a>
  );
}

function ArchiveMosaic() {
  return (
    <section className="archive-mosaic" id="projects" data-motion="archive" aria-labelledby="archive-title">
      <div className="archive-mosaic__intro" data-motion="archive-intro">
        <div className="folio-section-number">02</div>
        <Eyebrow>Projects / Selected work</Eyebrow>
        <Heading level={2} id="archive-title">Five studies of place and use.</Heading>
        <p>Academic projects across cultural infrastructure, interior space, vertical cities, and learning environments.</p>
      </div>
      <div className="archive-mosaic__grid">
        {projects.map((project, index) => <ProjectPlate key={project.slug} project={project} index={index} />)}
      </div>
    </section>
  );
}

function HomeContact() {
  return (
    <section className="home-contact" id="contact" data-motion="contact" aria-labelledby="home-contact-title">
      <div className="folio-section-number">04</div>
      <div className="home-contact__copy" data-motion="contact-copy">
        <Eyebrow>Contact</Eyebrow>
        <Heading level={2} id="home-contact-title">I am open to conversations about architecture, visualisation, and design.</Heading>
        <Link className="contact-email" color="inherit" href={`mailto:${contact.email}`}>{contact.email}<Arrow /></Link>
      </div>
      <div className="home-contact__details" data-motion="contact-details">
        {contact.phones.map((phone) => <a href={`tel:${phone.replace(/\s/g, '')}`} key={phone}>{phone}</a>)}
        <Link color="inherit" href="#profile">Read about my practice</Link>
      </div>
    </section>
  );
}

function ProfileSection() {
  return (
    <section className="profile-section" id="profile" data-motion="profile" aria-labelledby="profile-title">
      <div className="profile-section__number">01</div>
      <div className="profile-section__heading" data-motion="profile-heading">
        <Eyebrow>Profile</Eyebrow>
        <Heading level={2} id="profile-title">{profile.title}</Heading>
      </div>
      <div className="profile-section__portrait" data-motion="profile-portrait">
        <ImageFrame image={portrait} motionImage="profile-image" />
      </div>
      <div className="profile-section__copy" data-motion="profile-copy">
        <p>{profile.body}</p>
        <p>{profile.close}</p>
        <Link className="text-link" href="#projects">See the projects <Arrow /></Link>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="tools-section" id="practice" data-motion="tools" aria-labelledby="tools-title">
      <div className="tools-section__number">03</div>
      <div className="tools-section__heading" data-motion="tools-heading">
        <Eyebrow>Practice and tools</Eyebrow>
        <Heading level={2} id="tools-title">I work between architecture, image, and graphic composition.</Heading>
      </div>
      <div className="tools-section__register" data-motion="tools-register">
        <span>Working tools</span>
        <Stack className="tool-register" gap={2}>{tools.map((tool) => <span data-motion="tool-chip" key={tool}>{tool}</span>)}</Stack>
      </div>
    </section>
  );
}

function Footer() {
  const scrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <footer className="site-footer">
      <span>Maisha Mahpara / Architecture</span>
      <span>Selected academic work</span>
      <a href="#top" onClick={scrollToTop}>Back to top <Arrow direction="up" /></a>
    </footer>
  );
}

function HomePage({ hash }: { hash: string }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  useCinematicMotion(scopeRef, 'home', 'home');

  useLayoutEffect(() => {
    if (hash === '#/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      window.requestAnimationFrame(() => document.documentElement.removeAttribute('data-scroll-booting'));
      return;
    }
    const legacyTarget = hash === '#/about' ? 'profile' : hash.match(/^#\/about#(.+)$/)?.[1];
    window.requestAnimationFrame(() => {
      if (legacyTarget) document.getElementById(legacyTarget)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      document.documentElement.removeAttribute('data-scroll-booting');
    });
  }, [hash]);

  return (
    <div className="site-shell folio-root" id="top" ref={scopeRef} data-motion-page="home">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <FolioCover />
        <ProfileSection />
        <ArchiveMosaic />
        <ToolsSection />
        <HomeContact />
      </main>
      <Footer />
    </div>
  );
}

function ProjectFacts({ project }: { project: Project }) {
  const facts: Array<[string, string]> = [
    ['Category', project.category],
    ...(project.location ? [['Location', project.location] as [string, string]] : []),
    ...(project.client ? [['Client', project.client] as [string, string]] : []),
  ];

  return <dl className="project-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function ChapterIndex({ project }: { project: Project }) {
  return (
    <nav className="chapter-index" data-motion="chapter-index" aria-label={`${project.title} chapters`}>
      {project.sections.map((section, index) => (
        <a href={`#/projects/${project.slug}#${section.id}`} data-chapter-link={section.id} key={section.id}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{section.eyebrow}</span>
        </a>
      ))}
    </nav>
  );
}

function ProjectChapter({ section, index }: { section: ProjectSection; index: number }) {
  return (
    <article className={`project-chapter project-chapter--${section.layout}`} data-motion="chapter" data-chapter={section.id} data-motion-layout={section.layout} id={section.id}>
      <div className="project-chapter__heading" data-motion="chapter-heading">
        <Eyebrow>{String(index + 1).padStart(2, '0')} / {section.eyebrow}</Eyebrow>
        <Heading level={2} id={`${section.id}-title`}>{section.title}</Heading>
      </div>
      <div className="project-chapter__content" data-motion="chapter-body">
        {section.body && <p>{section.body}</p>}
        <div className="project-chapter__images">{section.images.map((image, imageIndex) => <ImageFrame image={image} motionFrame="chapter-image" motionImage="chapter-image-element" key={`${image.src}-${imageIndex}`} />)}</div>
      </div>
    </article>
  );
}

function ProjectNavigation({ project }: { project: Project }) {
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[(index - 1 + projects.length) % projects.length];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <section className="project-navigation atlas-section" data-motion="project-nav" aria-label="Project navigation">
      <div className="section-index"><Eyebrow>Continue through the archive</Eyebrow><span>→</span></div>
      <div className="project-navigation__links">
        {[previousProject, nextProject].map((item, itemIndex) => (
          <a href={`#/projects/${item.slug}`} className={`project-transition${itemIndex === 0 ? ' project-transition--previous' : ''}`} data-motion="project-transition" key={item.slug}>
            <ImageFrame image={item.hero} />
            <span className="project-transition__copy"><Eyebrow>{itemIndex === 0 ? 'Previous project' : 'Next project'} / {item.number}</Eyebrow><strong>{item.title}</strong><span>{item.subtitle}</span></span>
            <Arrow direction={itemIndex === 0 ? 'left' : 'right'} />
          </a>
        ))}
      </div>
    </section>
  );
}

function ProjectPage({ project, anchor }: { project: Project; anchor: string | null }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  useCinematicMotion(scopeRef, 'project', project.slug);

  useEffect(() => {
    if (anchor) {
      window.requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'auto', block: 'start' });
        document.documentElement.removeAttribute('data-scroll-booting');
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
      window.requestAnimationFrame(() => document.documentElement.removeAttribute('data-scroll-booting'));
    }
  }, [project.slug, anchor]);

  return (
    <div className={`site-shell folio-root project-root project-root--${project.visualMode}`} id="top" ref={scopeRef} data-motion-page="project">
      <SiteHeader projectPage />
      <main id="main-content">
        <section className="case-hero atlas-section" data-motion="case-hero" aria-labelledby="case-title">
          <div className="case-hero__meta" data-motion="case-meta"><a className="back-link" href="#/">Back to work</a><span>{project.number} / {project.category}</span></div>
          <div className="case-hero__copy" data-motion="case-copy"><Eyebrow>{project.category}</Eyebrow><Heading level={1} type="display-1" id="case-title">{project.title}</Heading><p>{project.subtitle}</p></div>
          <ImageFrame image={project.hero} className="case-hero__image" priority motionFrame="case-image" motionImage="case-hero-image" />
        </section>
        <section className="case-intro atlas-section" data-motion="case-intro">
          <div className="section-index" data-motion="intro-index"><Eyebrow>The premise</Eyebrow><span>{project.number}</span></div>
          <div className="case-intro__copy" data-motion="intro-copy"><p className="case-lead">{project.lead}</p><p>{project.description}</p><ProjectFacts project={project} /></div>
          <div className="case-intro__tags" data-motion="intro-tags"><Eyebrow>Keywords</Eyebrow>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </section>
        <ChapterIndex project={project} />
        <section className={`project-story project-story--${project.visualMode}`} aria-label={`${project.title} story`}>{project.sections.map((section, index) => <ProjectChapter key={section.id} section={section} index={index} />)}</section>
        <ProjectNavigation project={project} />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="site-shell folio-root not-found" id="top">
      <SiteHeader />
      <main id="main-content"><Eyebrow>Archive / 404</Eyebrow><Heading level={1}>This project is not in the folio.</Heading><a className="text-link" href="#/">Return to the portfolio <Arrow /></a></main>
    </div>
  );
}

export function App() {
  const { hash, projectSlug, projectAnchor, isAbout, aboutAnchor } = useRoute();
  const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : null;
  if (projectSlug && !project) return <NotFound />;
  if (isAbout) return <HomePage hash={aboutAnchor ? `#/about#${aboutAnchor}` : '#/about'} />;
  return project ? <ProjectPage project={project} anchor={projectAnchor} /> : <HomePage hash={hash} />;
}
