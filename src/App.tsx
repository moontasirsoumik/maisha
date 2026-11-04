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

const ASSET = '/assets/portfolio/';
const STORY_BREAKPOINT = 900;

function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const projectSlug = hash.match(/^#\/projects\/([^/?#]+)/)?.[1] ?? null;
  return { hash, projectSlug };
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

function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

function useStoryMotion(scopeRef: React.RefObject<HTMLElement | null>, key: string, kind: 'home' | 'project') {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root) return;

    root.classList.add('motion-ready');
    if (reducedMotion) {
      root.classList.add('motion-reduced');
      return;
    }
    root.classList.remove('motion-reduced');

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      gsap.fromTo(root.querySelectorAll<HTMLElement>('[data-load]'),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', clearProps: 'transform' },
      );

      media.add(`(min-width: ${STORY_BREAKPOINT + 1}px)`, () => {
        if (kind === 'home') {
          const hero = root.querySelector<HTMLElement>('[data-projection-hero]');
          const heroImage = root.querySelector<HTMLElement>('[data-hero-image]');
          const heroCopy = root.querySelector<HTMLElement>('[data-hero-copy]');
          const method = root.querySelector<HTMLElement>('[data-method-sequence]');
          const methodStages = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-method-stage]'));
          const methodCopies = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-method-copy]'));

          if (hero && heroImage && heroCopy) {
            gsap.timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=115%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            })
              .to(heroImage, { scale: 1.16, xPercent: -4, yPercent: 2, ease: 'none' }, 0)
              .to(heroCopy, { yPercent: -18, autoAlpha: 0.16, ease: 'none' }, 0.12)
              .to(hero.querySelector('[data-hero-after]'), { autoAlpha: 1, y: 0, ease: 'none' }, 0.38);
          }

          if (method && methodStages.length) {
            gsap.set([...methodStages.slice(1), ...methodCopies.slice(1)], { autoAlpha: 0, y: 24 });
            gsap.set(methodCopies[0], { autoAlpha: 1, y: 0 });
            const methodTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: method,
                start: 'top top',
                end: `+=${Math.max(180, methodStages.length * 105)}%`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });

            methodStages.forEach((stage, index) => {
              if (index > 0) {
                methodTimeline
                  .to([methodStages[index - 1], methodCopies[index - 1]], { autoAlpha: 0, y: -24, duration: 0.42, ease: 'power2.inOut' })
                  .to([stage, methodCopies[index]], { autoAlpha: 1, y: 0, duration: 0.72, ease: 'expo.out' }, '<0.12');
              }
            });
          }
        }

        if (kind === 'project') {
          const story = root.querySelector<HTMLElement>('[data-project-story]');
          const chapters = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-chapter]'));
          const panels = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-stage-panel]'));
          if (story && chapters.length && panels.length) {
            gsap.set(panels, { autoAlpha: 0, scale: 1.06 });
            gsap.set(panels[0], { autoAlpha: 1, scale: 1 });
            let activeIndex = 0;
            root.querySelector(`[data-chapter-link="${chapters[0].id}"]`)?.setAttribute('aria-current', 'step');

            const activateChapter = (index: number) => {
              if (index === activeIndex) return;
              const previous = panels[activeIndex];
              const next = panels[index];
              activeIndex = index;
              gsap.timeline()
                .to(previous, { autoAlpha: 0, scale: 1.06, duration: 0.5, ease: 'power2.inOut' })
                .to(next, { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'expo.out' }, '<0.12');
              chapters.forEach((chapter, chapterIndex) => {
                chapter.toggleAttribute('data-active', chapterIndex === index);
                const chapterLink = root.querySelector(`[data-chapter-link="${chapter.id}"]`);
                if (chapterLink) {
                  if (chapterIndex === index) chapterLink.setAttribute('aria-current', 'step');
                  else chapterLink.removeAttribute('aria-current');
                }
              });
            };

            chapters.forEach((chapter, index) => {
              ScrollTrigger.create({
                trigger: chapter,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => activateChapter(index),
                onEnterBack: () => activateChapter(index),
              });
            });
          }
        }
      });

      return () => media.revert();
    }, root);

    return () => {
      context.revert();
      root.classList.remove('motion-ready');
      root.classList.remove('motion-reduced');
    };
  }, [kind, key, reducedMotion, scopeRef]);
}

function Arrow({ direction = 'up' }: { direction?: 'up' | 'right' | 'down' }) {
  const rotation = direction === 'right' ? 0 : direction === 'down' ? 90 : -90;
  return (
    <span className="arrow-icon" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
      <svg viewBox="0 0 20 20" focusable="false">
        <path d="M2 10h15M11 4l6 6-6 6" />
      </svg>
    </span>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow${light ? ' eyebrow--light' : ''}`}>{children}</p>;
}

function ImageFrame({ image, className = '', priority = false }: { image: ProjectImage; className?: string; priority?: boolean }) {
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
          style={{ objectPosition: image.focalPoint ?? '50% 50%' }}
        />
      </div>
      {image.caption && <figcaption className="image-caption">{image.caption}</figcaption>}
    </figure>
  );
}

function SiteHeader({ projectPage = false, projectNumber }: { projectPage?: boolean; projectNumber?: string }) {
  return (
    <header className={`site-header${projectPage ? ' site-header--project' : ''}`}>
      <Link className="site-logo" href="#/" aria-label="Maisha Mahpara home">
        <span>Maisha</span> <span>Mahpara</span>
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {projectPage ? <Link href="#/">Back to archive</Link> : <>
          <Link href="#about">Method</Link>
          <Link href="#work">Work</Link>
          <Link href="#contact">Contact</Link>
        </>}
      </nav>
      <span className="header-status">{projectPage ? `Project ${projectNumber}` : 'Architecture / Portfolio'}</span>
    </header>
  );
}

function ReadingRail({ progress }: { progress: number }) {
  return (
    <aside className="reading-rail" aria-label="Reading progress">
      <span className="reading-rail__label">Read</span>
      <span className="reading-rail__track">
        <span className="reading-rail__fill" style={{ height: `${progress * 100}%` }} />
      </span>
      <span className="reading-rail__count">{Math.round(progress * 100)}%</span>
    </aside>
  );
}

function ProjectionHero() {
  return (
    <section className="projection-hero" data-projection-hero aria-labelledby="hero-title">
      <div className="projection-hero__wash" aria-hidden="true" />
      <div className="projection-hero__image" data-hero-image>
        <ImageFrame image={projects[0].hero} priority className="projection-image" />
        <span className="projection-hero__caption">Ethnic Cultural Institute / Rangamati</span>
      </div>
      <div className="projection-hero__copy" data-hero-copy data-load>
        <Eyebrow light>Architecture / Research / Visualisation</Eyebrow>
        <Heading level={1} type="display-1" id="hero-title" className="projection-hero__title">
          <span>Maisha</span>
          <span>Mahpara</span>
        </Heading>
        <Text as="p" type="large" className="projection-hero__statement">
          I begin with people, culture, climate, and daily life, then translate what I learn into space.
        </Text>
        <Button
          className="story-button"
          label="View selected work"
          href="#work"
          variant="ghost"
          endContent={<Arrow direction="right" />}
        />
      </div>
      <div className="projection-hero__after" data-hero-after aria-hidden="true">
        <span>01</span>
        <span>Enter the archive</span>
      </div>
      <div className="projection-hero__footer" data-load>
        <span>RUET / Architecture</span>
        <span>Scroll to enter</span>
      </div>
    </section>
  );
}

const methodStages = [
  {
    id: 'read',
    eyebrow: '01 / Read the place',
    title: 'I look at what a place already holds.',
    body: 'I begin with site analysis, cultural practice, climate, and the everyday activities a project needs to support.',
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
    title: 'I use the image to test the architecture.',
    body: 'Details, material studies, and visualisation help me understand how a project will be experienced, not only how it will look.',
    image: projects[2].sections[0].images[0],
  },
];

function MethodSequence() {
  return (
    <section className="method-section page-section" id="about" aria-labelledby="method-title">
      <div className="method-intro">
        <Eyebrow>Method / 02</Eyebrow>
        <Heading level={2} id="method-title">A project starts before the building.</Heading>
        <p>{profile.body}</p>
      </div>
      <div className="method-sequence" data-method-sequence>
        <div className="method-sequence__visual" aria-hidden="true">
          {methodStages.map((stage) => (
            <div className="method-stage" data-method-stage key={stage.id}>
              <img src={stage.image.src} alt="" width={stage.image.width} height={stage.image.height} />
              <span>{stage.image.caption}</span>
            </div>
          ))}
        </div>
        <div className="method-sequence__copy">
          {methodStages.map((stage) => (
            <article className="method-copy" data-method-copy key={stage.id}>
              <Eyebrow>{stage.eyebrow}</Eyebrow>
              <Heading level={3}>{stage.title}</Heading>
              <p>{stage.body}</p>
              <div className="method-copy__mobile-image"><ImageFrame image={stage.image} /></div>
            </article>
          ))}
        </div>
      </div>
      <div className="method-close">
        <p>{profile.close}</p>
        <Link className="story-link" href={`mailto:${contact.email}`}>Start a conversation <Arrow direction="right" /></Link>
      </div>
    </section>
  );
}

function ArchiveRow({ project, active, onActivate }: { project: Project; active: boolean; onActivate: () => void }) {
  return (
    <a
      className={`archive-row${active ? ' is-active' : ''}`}
      href={`#/projects/${project.slug}`}
      onPointerEnter={onActivate}
      onFocus={onActivate}
      aria-current={active ? 'true' : undefined}
    >
      <span className="archive-row__number">{project.number}</span>
      <span className="archive-row__title">
        <strong>{project.title}</strong>
        <small>{project.subtitle}</small>
      </span>
      <span className="archive-row__category">{project.category}</span>
      <span className="archive-row__arrow"><Arrow direction="right" /></span>
    </a>
  );
}

function ProjectArchive() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section className="archive-section page-section" id="work" aria-labelledby="archive-title">
      <div className="archive-intro">
        <div>
          <Eyebrow>Selected work / 03</Eyebrow>
          <Heading level={2} id="archive-title">Five ways of making a place public.</Heading>
        </div>
        <p>I explore cultural infrastructure, public life, interiors, vertical cities, and learning environments through academic projects.</p>
      </div>
      <div className="archive-layout">
        <div className={`archive-stage archive-stage--${activeProject.visualMode}`} aria-live="polite">
          {projects.map((project, index) => (
            <div className={`archive-stage__image${index === activeIndex ? ' is-active' : ''}`} key={project.slug} aria-hidden={index !== activeIndex}>
              <img src={project.hero.src} alt="" width={project.hero.width} height={project.hero.height} style={{ objectPosition: project.hero.focalPoint }} />
            </div>
          ))}
          <div className="archive-stage__meta">
            <span>{activeProject.category}</span>
            <strong>{activeProject.title}</strong>
            <small>{activeProject.location ?? activeProject.subtitle}</small>
          </div>
        </div>
        <div className="archive-list">
          {projects.map((project, index) => (
            <ArchiveRow key={project.slug} project={project} active={index === activeIndex} onActivate={() => setActiveIndex(index)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticeSection() {
  return (
    <section className="practice-section page-section" aria-labelledby="practice-title">
      <div className="practice-heading">
        <Eyebrow>Practice / 04</Eyebrow>
        <Heading level={2} id="practice-title">I work between research, drawing, and visualisation.</Heading>
      </div>
      <div className="practice-content">
        <Text as="p" type="large" className="practice-statement">I move from research, site analysis, and concept to plans, sections, details, and visualisation. The final image is one part of the architecture.</Text>
        <Stack className="tool-list" gap={2}>
          <span className="tool-list__label">Working tools</span>
          {tools.map((tool) => <span key={tool}>{tool}</span>)}
        </Stack>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section page-section" id="contact" aria-labelledby="contact-title">
      <Eyebrow light>Contact / 05</Eyebrow>
      <div className="contact-copy">
        <Heading level={2} id="contact-title">Let’s talk<br />about the work.</Heading>
        <p>I welcome conversations about architecture, visualization, and design.</p>
        <Link className="contact-email" href={`mailto:${contact.email}`}>{contact.email}<Arrow direction="right" /></Link>
      </div>
      <div className="contact-meta">
        <span>{contact.phones.join(' / ')}</span>
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
      <a href="#top" onClick={scrollToTop}>Back to top <Arrow /></a>
    </footer>
  );
}

function HomePage() {
  const progress = useReadingProgress();
  const scopeRef = useRef<HTMLDivElement>(null);
  useStoryMotion(scopeRef, 'home', 'home');

  return (
    <div className="site-shell story-root" id="top" ref={scopeRef}>
      <SiteHeader />
      <ReadingRail progress={progress} />
      <main id="main-content">
        <ProjectionHero />
        <MethodSequence />
        <ProjectArchive />
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
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectChapter({ section, index }: { section: ProjectSection; index: number }) {
  const primaryImage = section.images[0];
  return (
    <article className={`chapter chapter--${section.motion}`} id={section.id} data-chapter data-active={index === 0}>
      <div className="chapter__copy">
        <Eyebrow>{String(index + 1).padStart(2, '0')} / {section.eyebrow}</Eyebrow>
        <Heading level={2} id={`${section.id}-title`}>{section.title}</Heading>
        {section.body && <p>{section.body}</p>}
        {section.images.length > 1 && (
          <div className="chapter__supporting-media">
            {section.images.slice(1).map((image, imageIndex) => <ImageFrame key={`${image.src}-${imageIndex}`} image={image} />)}
          </div>
        )}
        <div className="chapter__mobile-media">
          <ImageFrame image={primaryImage} />
        </div>
      </div>
    </article>
  );
}

function ProjectStory({ project }: { project: Project }) {
  return (
    <section className={`project-story project-story--${project.visualMode}`} data-project-story aria-label="Project story">
      <div className="project-story__stage" aria-hidden="true">
        {project.sections.map((section) => {
          const image = section.images[0];
          return (
            <div className={`stage-panel stage-panel--${section.motion}`} data-stage-panel key={section.id}>
              <img src={image.src} alt="" width={image.width} height={image.height} style={{ objectPosition: image.focalPoint }} />
              <span>{image.caption}</span>
            </div>
          );
        })}
      </div>
      <div className="project-story__rail">
        <Eyebrow>Reading the project</Eyebrow>
        <nav aria-label={`${project.title} chapters`}>
          {project.sections.map((section, index) => (
            <a key={section.id} data-chapter-link={section.id} href={`#${section.id}`} aria-label={`Go to ${section.eyebrow}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{section.eyebrow}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="project-story__chapters">
        {project.sections.map((section, index) => <ProjectChapter key={section.id} section={section} index={index} />)}
      </div>
    </section>
  );
}

function ProjectNavigation({ project }: { project: Project }) {
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[(index - 1 + projects.length) % projects.length];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <section className="next-project page-section" aria-label="Project navigation">
      <Eyebrow>Continue through the archive</Eyebrow>
      <div className="project-navigation">
        {[previousProject, nextProject].map((item, itemIndex) => (
          <a href={`#/projects/${item.slug}`} className={`next-project__link${itemIndex === 0 ? ' next-project__link--previous' : ''}`} aria-label={`${itemIndex === 0 ? 'Previous' : 'Next'} project: ${item.title}`} key={item.slug}>
            <span className="next-project__image"><img src={item.hero.src} alt="" width={item.hero.width} height={item.hero.height} /></span>
            <span className="next-project__copy">
              <small>{itemIndex === 0 ? 'Previous project' : 'Next project'} / {item.number}</small>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </span>
            <Arrow direction="right" />
          </a>
        ))}
      </div>
    </section>
  );
}

function ProjectPage({ project }: { project: Project }) {
  const progress = useReadingProgress();
  const scopeRef = useRef<HTMLDivElement>(null);
  useStoryMotion(scopeRef, project.slug, 'project');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [project.slug]);

  return (
    <div className={`site-shell site-shell--case-study story-root story-root--${project.visualMode}`} id="top" ref={scopeRef}>
      <SiteHeader projectPage projectNumber={project.number} />
      <ReadingRail progress={progress} />
      <main id="main-content">
        <section className="case-hero page-section" aria-labelledby="case-title">
          <div className="case-hero__meta" data-load>
            <a className="back-link" href="#/"><Arrow /> Back to archive</a>
            <span>{project.number} / {project.category}</span>
          </div>
          <div className="case-hero__copy" data-load>
            <Eyebrow>{project.category}</Eyebrow>
            <Heading level={1} type="display-1" id="case-title" className="case-title">{project.title}</Heading>
            <p className="case-subtitle">{project.subtitle}</p>
          </div>
          <ImageFrame image={project.hero} className="case-hero__image" priority />
        </section>
        <section className="case-intro page-section">
          <div className="case-intro__label"><Eyebrow>The premise</Eyebrow><span>{project.number}</span></div>
          <div className="case-intro__body">
            <p className="case-lead">{project.lead}</p>
            <p>{project.description}</p>
            <ProjectFacts project={project} />
          </div>
          <div className="case-tags">
            <span>Keywords</span>
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>
        <ProjectStory project={project} />
        <ProjectNavigation project={project} />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <main id="main-content" className="not-found">
        <Eyebrow>Archive / 404</Eyebrow>
        <Heading level={1}>This project is not in the folio.</Heading>
        <a className="story-link" href="#/">Return to the portfolio <Arrow direction="right" /></a>
      </main>
    </div>
  );
}

export function App() {
  const { projectSlug } = useRoute();
  const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : null;
  if (projectSlug && !project) return <NotFound />;
  return project ? <ProjectPage project={project} /> : <HomePage />;
}
