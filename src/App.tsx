import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { contact, profile, projects, tools, type Project, type ProjectImage, type ProjectSection } from './content/projects';

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
    anchor: hash.match(/^#\/projects\/[^/?#]+#(.+)$/)?.[1] ?? null,
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

function useAtlasMotion(scopeRef: React.RefObject<HTMLElement | null>, key: string) {
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

      gsap.fromTo(
        root.querySelectorAll<HTMLElement>('[data-load]'),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' },
      );

      gsap.utils.toArray<HTMLElement>(root.querySelectorAll<HTMLElement>('[data-sheet]')).forEach((sheet, index) => {
        gsap.fromTo(
          sheet,
          { autoAlpha: 0, y: 34, clipPath: 'inset(8% 0 0 0)' },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            delay: Math.min(index * 0.03, 0.18),
            ease: 'expo.out',
            scrollTrigger: { trigger: sheet, start: 'top 88%', once: true },
          },
        );
      });

      media.add(`(min-width: ${STORY_BREAKPOINT + 1}px)`, () => {
        gsap.utils.toArray<HTMLElement>(root.querySelectorAll<HTMLElement>('[data-atlas-parallax]')).forEach((image) => {
          gsap.to(image, {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          });
        });
      });

      return () => media.revert();
    }, root);

    return () => {
      context.revert();
      root.classList.remove('motion-ready', 'motion-reduced');
    };
  }, [key, reducedMotion, scopeRef]);
}

function Arrow({ direction = 'right' }: { direction?: 'right' | 'left' | 'down' | 'up' }) {
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

function SiteHeader({ projectPage = false }: { projectPage?: boolean }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-logo" href="#/" aria-label="Maisha Mahpara home">Maisha Mahpara</Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {projectPage ? <Link href="#/">Back to work</Link> : <>
            <Link href="#work">Work</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </>}
        </nav>
      </div>
    </header>
  );
}

function AtlasHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section className="atlas-hero" aria-labelledby="hero-title">
      <div className="atlas-hero__topline" data-load>
        <Eyebrow>Architecture / Portfolio</Eyebrow>
        <span>Selected work, 01 to 05</span>
      </div>
      <div className="atlas-hero__intro" data-load>
        <Eyebrow>Maisha Mahpara / RUET</Eyebrow>
        <Heading level={1} id="hero-title">Projects shaped by place, program, and use.</Heading>
        <Text as="p" type="large">I am an architecture graduate working across conceptual design, visualisation, 3D modelling, architectural photography, and graphic design.</Text>
        <Button className="atlas-button" label="Browse the work" href="#work" variant="ghost" endContent={<Arrow />} />
      </div>
      <div className="atlas-hero__feature" aria-live="polite" data-sheet>
        {projects.map((project, index) => (
          <div className={`atlas-feature-image${index === activeIndex ? ' is-active' : ''}`} key={project.slug} aria-hidden={index !== activeIndex}>
            <img src={project.hero.src} alt={index === activeIndex ? project.hero.alt : ''} width={project.hero.width} height={project.hero.height} style={{ objectPosition: project.hero.focalPoint }} />
          </div>
        ))}
        <div className="atlas-hero__feature-caption">
          <span>{activeProject.number} / {activeProject.category}</span>
          <strong>{activeProject.title}</strong>
          <span>{activeProject.subtitle}</span>
        </div>
      </div>
      <div className="atlas-hero__register" data-sheet>
        <div className="register-heading">
          <Eyebrow>The archive</Eyebrow>
          <span>Choose a study</span>
        </div>
        {projects.map((project, index) => (
          <a
            key={project.slug}
            href={`#/projects/${project.slug}`}
            className={`register-row${index === activeIndex ? ' is-active' : ''}`}
            onPointerEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <span className="register-row__number">{project.number}</span>
            <span className="register-row__title"><strong>{project.title}</strong><small>{project.subtitle}</small></span>
            <span className="register-row__category">{project.category}</span>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section atlas-section" id="about" aria-labelledby="about-title">
      <div className="section-index" data-sheet><Eyebrow>About / 01</Eyebrow><span>01</span></div>
      <div className="about-section__copy" data-sheet>
        <Heading level={2} id="about-title">{profile.title}</Heading>
        <p>{profile.body}</p>
        <p>{profile.close}</p>
        <Link className="text-link" href={`mailto:${contact.email}`}>Write to me <Arrow /></Link>
      </div>
      <div className="about-section__portrait" data-sheet>
        <ImageFrame image={{ src: '/assets/portfolio/profile.webp', alt: 'Portrait of Maisha Mahpara seated in a garden', width: 740, height: 920, caption: 'Maisha Mahpara' }} />
      </div>
    </section>
  );
}

const methodStages = [
  {
    id: 'read',
    eyebrow: '01 / Read the place',
    title: 'I start with the evidence around a site.',
    body: 'I look at settlement patterns, cultural practice, climate, material, and the everyday activities a project needs to support.',
    image: projects[0].sections[0].images[0],
  },
  {
    id: 'organize',
    eyebrow: '02 / Organize the program',
    title: 'I turn research into a spatial framework.',
    body: 'I use plans, sections, and movement to connect learning, performance, gathering, living, and making.',
    image: projects[1].sections[1].images[0],
  },
  {
    id: 'make',
    eyebrow: '03 / Make space',
    title: 'I test the architecture through detail and image.',
    body: 'Material studies, furniture details, sections, and visualisation help me understand how a project will be experienced.',
    image: projects[2].sections[0].images[0],
  },
];

function ProcessSection() {
  return (
    <section className="process-section atlas-section" id="process" aria-labelledby="process-title">
      <div className="section-index" data-sheet><Eyebrow>Process / 02</Eyebrow><span>02</span></div>
      <div className="process-section__heading" data-sheet>
        <Heading level={2} id="process-title">From observation to space.</Heading>
        <p>I move from research and site analysis to plans, sections, details, and visualisation. Each project changes the order, but not the attention.</p>
      </div>
      <div className="process-sheets">
        {methodStages.map((stage, index) => (
          <article className={`process-sheet process-sheet--${index + 1}`} data-sheet key={stage.id}>
            <div className="process-sheet__image"><ImageFrame image={stage.image} parallax /></div>
            <div className="process-sheet__copy">
              <Eyebrow>{stage.eyebrow}</Eyebrow>
              <Heading level={3}>{stage.title}</Heading>
              <p>{stage.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkIndex() {
  return (
    <section className="work-section atlas-section" id="work" aria-labelledby="work-title">
      <div className="section-index" data-sheet><Eyebrow>Selected work / 03</Eyebrow><span>03</span></div>
      <div className="work-section__heading" data-sheet>
        <Heading level={2} id="work-title">Five studies of shared life.</Heading>
        <p>Academic projects across cultural infrastructure, interior space, vertical cities, and learning environments.</p>
      </div>
      <div className="work-list">
        {projects.map((project) => (
          <a className={`work-entry work-entry--${project.visualMode}`} href={`#/projects/${project.slug}`} key={project.slug} data-sheet>
            <div className="work-entry__meta"><span>{project.number}</span><span>{project.category}</span></div>
            <div className="work-entry__title"><Heading level={3}>{project.title}</Heading><p>{project.subtitle}</p></div>
            <ImageFrame image={project.hero} className="work-entry__image" parallax />
            <div className="work-entry__action"><span>View project</span><Arrow /></div>
          </a>
        ))}
      </div>
    </section>
  );
}

function PracticeSection() {
  return (
    <section className="practice-section atlas-section" aria-labelledby="practice-title">
      <div className="section-index" data-sheet><Eyebrow>Practice / 04</Eyebrow><span>04</span></div>
      <div className="practice-section__copy" data-sheet>
        <Heading level={2} id="practice-title">I work between architecture, image, and graphic composition.</Heading>
        <Text as="p" type="large">I use visualisation and graphic design to test ideas, communicate atmosphere, and make a project legible from its first diagram to its final view.</Text>
      </div>
      <div className="practice-section__tools" data-sheet>
        <Eyebrow>Working tools</Eyebrow>
        <Stack className="tool-list" gap={2}>
          {tools.map((tool) => <span key={tool}>{tool}</span>)}
        </Stack>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section atlas-section" id="contact" aria-labelledby="contact-title">
      <div className="section-index section-index--light" data-sheet><Eyebrow>Contact / 05</Eyebrow><span>05</span></div>
      <div className="contact-section__copy" data-sheet>
        <Heading level={2} id="contact-title">I would like to hear about the work you are building.</Heading>
        <p>I am available for conversations about architecture, visualisation, and design.</p>
        <Link className="contact-email" href={`mailto:${contact.email}`}>{contact.email}<Arrow /></Link>
      </div>
      <div className="contact-section__details" data-sheet>
        {contact.phones.map((phone) => <a href={`tel:${phone.replace(/\s/g, '')}`} key={phone}>{phone}</a>)}
        <span>Architecture / Research / Visualisation</span>
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
  useAtlasMotion(scopeRef, 'home');

  useEffect(() => {
    if (hash === '#/') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [hash]);

  return (
    <div className="site-shell atlas-root" id="top" ref={scopeRef}>
      <SiteHeader />
      <main id="main-content">
        <AtlasHero />
        <AboutSection />
        <ProcessSection />
        <WorkIndex />
        <PracticeSection />
        <ContactSection />
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

  return (
    <dl className="project-facts">
      {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  );
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
        <div className="project-chapter__images">
          {section.images.map((image, imageIndex) => <ImageFrame image={image} key={`${image.src}-${imageIndex}`} parallax={imageIndex === 0} />)}
        </div>
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
            <span className="project-transition__copy">
              <Eyebrow>{itemIndex === 0 ? 'Previous project' : 'Next project'} / {item.number}</Eyebrow>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </span>
            <Arrow direction={itemIndex === 0 ? 'left' : 'right'} />
          </a>
        ))}
      </div>
    </section>
  );
}

function ProjectPage({ project, anchor }: { project: Project; anchor: string | null }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  useAtlasMotion(scopeRef, project.slug);

  useEffect(() => {
    if (anchor) {
      window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'auto', block: 'start' }));
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [project.slug, anchor]);

  return (
    <div className={`site-shell atlas-root project-root project-root--${project.visualMode}`} id="top" ref={scopeRef}>
      <SiteHeader projectPage />
      <main id="main-content">
        <section className="case-hero atlas-section" aria-labelledby="case-title">
          <div className="case-hero__meta" data-load><a className="back-link" href="#/">← Back to work</a><span>{project.number} / {project.category}</span></div>
          <div className="case-hero__copy" data-load>
            <Eyebrow>{project.category}</Eyebrow>
            <Heading level={1} type="display-1" id="case-title">{project.title}</Heading>
            <p>{project.subtitle}</p>
          </div>
          <ImageFrame image={project.hero} className="case-hero__image" priority parallax />
        </section>
        <section className="case-intro atlas-section" data-sheet>
          <div className="section-index"><Eyebrow>The premise</Eyebrow><span>{project.number}</span></div>
          <div className="case-intro__copy"><p className="case-lead">{project.lead}</p><p>{project.description}</p><ProjectFacts project={project} /></div>
          <div className="case-intro__tags"><Eyebrow>Keywords</Eyebrow>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </section>
        <ChapterIndex project={project} />
        <section className={`project-story project-story--${project.visualMode}`} aria-label={`${project.title} story`}>
          {project.sections.map((section, index) => <ProjectChapter key={section.id} section={section} index={index} />)}
        </section>
        <ProjectNavigation project={project} />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="site-shell atlas-root not-found" id="top">
      <SiteHeader />
      <main id="main-content">
        <Eyebrow>Archive / 404</Eyebrow>
        <Heading level={1}>This project is not in the folio.</Heading>
        <a className="text-link" href="#/">Return to the portfolio <Arrow /></a>
      </main>
    </div>
  );
}

export function App() {
  const { hash, projectSlug, anchor } = useRoute();
  const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : null;
  if (projectSlug && !project) return <NotFound />;
  return project ? <ProjectPage project={project} anchor={anchor} /> : <HomePage hash={hash} />;
}
