import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import {
  contact,
  portfolioCover,
  portrait,
  profile,
  projects,
  tools,
  type Project,
  type ProjectImage,
  type ProjectSection,
} from './content/projects';

gsap.registerPlugin(ScrollTrigger);

const STORY_BREAKPOINT = 760;

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

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function useFolioMotion(scopeRef: React.RefObject<HTMLElement | null>, key: string, kind: 'home' | 'about' | 'project') {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root) return;

    root.classList.add('motion-ready');
    if (reducedMotion) {
      root.classList.add('motion-reduced');
      return () => root.classList.remove('motion-ready', 'motion-reduced');
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      const reveal = (selector: string, offset = 32) => {
        root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: offset, clipPath: 'inset(8% 0 0 0)' },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: 'inset(0% 0 0 0)',
              duration: 1,
              delay: Math.min(index * 0.06, 0.24),
              ease: 'expo.out',
              scrollTrigger: { trigger: element, start: 'top 86%', once: true },
            },
          );
        });
      };

      gsap.fromTo(
        root.querySelectorAll<HTMLElement>('[data-load]'),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' },
      );

      if (kind === 'home') {
        const cover = root.querySelector<HTMLElement>('[data-cover]');
        const coverCopy = root.querySelector<HTMLElement>('[data-cover-copy]');
        const coverPlate = root.querySelector<HTMLElement>('[data-cover-plate]');

        media.add(`(min-width: ${STORY_BREAKPOINT + 1}px)`, () => {
          if (cover && coverCopy && coverPlate) {
            gsap.timeline({
              scrollTrigger: {
                trigger: cover,
                start: 'top top',
                end: '+=78%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            })
              .to(coverCopy, { yPercent: -12, autoAlpha: 0.35, ease: 'none' }, 0)
              .to(coverPlate, { yPercent: -8, scale: 0.94, clipPath: 'inset(0 0 0 12%)', ease: 'none' }, 0);
          }
        });

        reveal('[data-plate]', 44);
      }

      if (kind === 'about') {
        reveal('[data-about-group]', 30);
        reveal('[data-about-reference]', 44);
        const aboutPortrait = root.querySelector<HTMLElement>('[data-about-portrait]');
        if (aboutPortrait) {
          gsap.fromTo(aboutPortrait, { clipPath: 'inset(18% 0 0 0)' }, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: aboutPortrait, start: 'top 82%', once: true },
          });
        }
      }

      if (kind === 'project') reveal('[data-sheet]', 34);

      media.add(`(min-width: ${STORY_BREAKPOINT + 1}px)`, () => {
        root.querySelectorAll<HTMLElement>('[data-atlas-parallax]').forEach((image) => {
          gsap.to(image, {
            yPercent: -3,
            ease: 'none',
            scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
          });
        });
      });

      return () => media.revert();
    }, root);

    return () => {
      context.revert();
      root.classList.remove('motion-ready', 'motion-reduced');
    };
  }, [key, kind, reducedMotion, scopeRef]);
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

function ImageFrame({ image, className = '', priority = false, parallax = false }: { image: ProjectImage; className?: string; priority?: boolean; parallax?: boolean }) {
  return (
    <figure className={`image-frame ${className}`}>
      <div className="image-window">
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          data-atlas-parallax={parallax ? true : undefined}
          style={{ objectPosition: image.focalPoint ?? '50% 50%' }}
        />
      </div>
      {image.caption && <figcaption className="image-caption">{image.caption}</figcaption>}
    </figure>
  );
}

function SiteHeader({ projectPage = false, aboutPage = false }: { projectPage?: boolean; aboutPage?: boolean }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-logo" href="#/" aria-label="Maisha Mahpara home">Maisha Mahpara</Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {projectPage ? <>
            <Link href="#/">Back to projects</Link>
            <Link href="#/about">About</Link>
          </> : aboutPage ? <>
            <Link href="#/">Projects</Link>
            <Link href="#/about#contact">Contact</Link>
          </> : <>
            <Link href="#work">Projects</Link>
            <Link href="#/about">About</Link>
            <Link href="#contact">Contact</Link>
          </>}
        </nav>
      </div>
    </header>
  );
}

function FolioCover() {
  return (
    <section className="folio-cover" data-cover aria-labelledby="cover-title">
      <div className="folio-cover__copy" data-cover-copy data-load>
        <div className="folio-cover__number">00</div>
        <Eyebrow>Architecture portfolio</Eyebrow>
        <Heading level={1} id="cover-title"><span>Maisha</span> <em>Mahpara</em></Heading>
        <Text as="p" type="large">I begin with the place, the people, and the everyday life a project needs to hold.</Text>
        <Button className="folio-button" label="Open projects" href="#work" variant="ghost" endContent={<Arrow />} />
      </div>
      <div className="folio-cover__plate" data-cover-plate data-load>
        <ImageFrame image={portfolioCover} priority />
      </div>
      <div className="folio-cover__meta" data-load>
        <span>Maisha Mahpara</span>
        <span>RUET / Architecture</span>
        <span>01—05 / Selected work</span>
      </div>
    </section>
  );
}

function ProjectPlate({ project, index }: { project: Project; index: number }) {
  return (
    <a className={`project-plate project-plate--${index + 1} project-plate--${project.visualMode}`} href={`#/projects/${project.slug}`} data-plate>
      <ImageFrame image={project.hero} parallax />
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
    <section className="archive-mosaic" id="work" data-archive aria-labelledby="archive-title">
      <div className="archive-mosaic__intro" data-plate>
        <div className="folio-section-number">01</div>
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
    <section className="home-contact" id="contact" aria-labelledby="home-contact-title">
      <div className="folio-section-number">02</div>
      <div className="home-contact__copy">
        <Eyebrow>Contact</Eyebrow>
        <Heading level={2} id="home-contact-title">I am open to conversations about architecture, visualisation, and design.</Heading>
        <Link className="contact-email" href={`mailto:${contact.email}`}>{contact.email}<Arrow /></Link>
      </div>
      <div className="home-contact__details">
        {contact.phones.map((phone) => <a href={`tel:${phone.replace(/\s/g, '')}`} key={phone}>{phone}</a>)}
        <Link href="#/about">Read about my practice</Link>
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
  useFolioMotion(scopeRef, 'home', 'home');

  useEffect(() => {
    if (hash === '#/') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [hash]);

  return (
    <div className="site-shell folio-root" id="top" ref={scopeRef}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <FolioCover />
        <ArchiveMosaic />
        <HomeContact />
      </main>
      <Footer />
    </div>
  );
}

const aboutReferences = [projects[0], projects[1], projects[4]];

function AboutPage({ anchor }: { anchor: string | null }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  useFolioMotion(scopeRef, 'about', 'about');

  useEffect(() => {
    if (anchor) {
      window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'auto', block: 'start' }));
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [anchor]);

  return (
    <div className="site-shell about-root folio-root" id="top" ref={scopeRef}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader aboutPage />
      <main id="main-content">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero__number" data-load>01</div>
          <div className="about-hero__label" data-load><Eyebrow>About / Maisha Mahpara</Eyebrow><span>Architecture graduate / RUET</span></div>
          <div className="about-hero__statement" data-about-group>
            <Heading level={1} id="about-title">{profile.title}</Heading>
          </div>
          <div className="about-hero__portrait" data-about-portrait>
            <ImageFrame image={portrait} priority />
          </div>
          <div className="about-hero__caption" data-load><span>01 / 04</span><span>Profile</span></div>
        </section>
        <section className="about-practice" aria-labelledby="practice-title">
          <div className="folio-section-number" data-about-group>02</div>
          <div className="about-practice__heading" data-about-group>
            <Eyebrow>Practice</Eyebrow>
            <Heading level={2} id="practice-title">I work from what a place already holds.</Heading>
          </div>
          <div className="about-practice__copy" data-about-group>
            <p>{profile.body}</p>
            <p>{profile.close}</p>
          </div>
        </section>
        <section className="about-references" aria-labelledby="references-title">
          <div className="folio-section-number" data-about-group>03</div>
          <div className="about-references__heading" data-about-group>
            <Eyebrow>Selected references</Eyebrow>
            <Heading level={2} id="references-title">The projects behind the way I work.</Heading>
          </div>
          <div className="about-references__grid">
            {aboutReferences.map((project) => (
              <a className="about-reference" data-about-reference href={`#/projects/${project.slug}`} key={project.slug}>
                <ImageFrame image={project.hero} />
                <span>{project.number} / {project.category}</span>
                <strong>{project.title}</strong>
                <small>{project.subtitle}</small>
              </a>
            ))}
          </div>
        </section>
        <section className="about-tools" id="contact" aria-labelledby="tools-title">
          <div className="folio-section-number" data-about-group>04</div>
          <div className="about-tools__heading" data-about-group>
            <Eyebrow>Tools and contact</Eyebrow>
            <Heading level={2} id="tools-title">I use drawings, images, and software to make the work clear.</Heading>
          </div>
          <div className="about-tools__register" data-about-group>
            <span>Working tools</span>
            <Stack className="tool-register" gap={2}>{tools.map((tool) => <span key={tool}>{tool}</span>)}</Stack>
            <Link className="contact-email" href={`mailto:${contact.email}`}>{contact.email}<Arrow /></Link>
            <div className="about-tools__phones">{contact.phones.map((phone) => <a href={`tel:${phone.replace(/\s/g, '')}`} key={phone}>{phone}</a>)}</div>
          </div>
        </section>
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
    <nav className="chapter-index" aria-label={`${project.title} chapters`}>
      {project.sections.map((section, index) => (
        <a href={`#/projects/${project.slug}#${section.id}`} key={section.id}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{section.eyebrow}</span>
        </a>
      ))}
    </nav>
  );
}

function ProjectChapter({ section, index }: { section: ProjectSection; index: number }) {
  return (
    <article className={`project-chapter project-chapter--${section.layout} project-chapter--${section.motion}`} id={section.id} data-sheet>
      <div className="project-chapter__heading">
        <Eyebrow>{String(index + 1).padStart(2, '0')} / {section.eyebrow}</Eyebrow>
        <Heading level={2} id={`${section.id}-title`}>{section.title}</Heading>
      </div>
      <div className="project-chapter__content">
        {section.body && <p>{section.body}</p>}
        <div className="project-chapter__images">{section.images.map((image, imageIndex) => <ImageFrame image={image} key={`${image.src}-${imageIndex}`} parallax={imageIndex === 0} />)}</div>
      </div>
    </article>
  );
}

function ProjectNavigation({ project }: { project: Project }) {
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[(index - 1 + projects.length) % projects.length];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <section className="project-navigation atlas-section" aria-label="Project navigation">
      <div className="section-index" data-sheet><Eyebrow>Continue through the archive</Eyebrow><span>→</span></div>
      <div className="project-navigation__links">
        {[previousProject, nextProject].map((item, itemIndex) => (
          <a href={`#/projects/${item.slug}`} className={`project-transition${itemIndex === 0 ? ' project-transition--previous' : ''}`} key={item.slug} data-sheet>
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
  useFolioMotion(scopeRef, project.slug, 'project');

  useEffect(() => {
    if (anchor) window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'auto', block: 'start' }));
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }, [project.slug, anchor]);

  return (
    <div className={`site-shell folio-root project-root project-root--${project.visualMode}`} id="top" ref={scopeRef}>
      <SiteHeader projectPage />
      <main id="main-content">
        <section className="case-hero atlas-section" aria-labelledby="case-title">
          <div className="case-hero__meta" data-load><a className="back-link" href="#/">Back to work</a><span>{project.number} / {project.category}</span></div>
          <div className="case-hero__copy" data-load><Eyebrow>{project.category}</Eyebrow><Heading level={1} type="display-1" id="case-title">{project.title}</Heading><p>{project.subtitle}</p></div>
          <ImageFrame image={project.hero} className="case-hero__image" priority parallax />
        </section>
        <section className="case-intro atlas-section" data-sheet>
          <div className="section-index"><Eyebrow>The premise</Eyebrow><span>{project.number}</span></div>
          <div className="case-intro__copy"><p className="case-lead">{project.lead}</p><p>{project.description}</p><ProjectFacts project={project} /></div>
          <div className="case-intro__tags"><Eyebrow>Keywords</Eyebrow>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
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
  if (isAbout) return <AboutPage anchor={aboutAnchor} />;
  return project ? <ProjectPage project={project} anchor={projectAnchor} /> : <HomePage hash={hash} />;
}
