import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MotionPage = 'home' | 'project';

function one<T extends Element>(root: HTMLElement, selector: string) {
  return root.querySelector<T>(selector);
}

function many<T extends Element>(root: HTMLElement, selector: string) {
  return Array.from(root.querySelectorAll<T>(selector));
}

function clearMotionStyles(root: HTMLElement) {
  many<HTMLElement>(root, '[data-motion]').forEach((element) => {
    element.style.removeProperty('transform');
    element.style.removeProperty('opacity');
    element.style.removeProperty('clip-path');
    element.style.removeProperty('transform-origin');
    element.style.removeProperty('will-change');
  });
}

function revealOnScroll(target: Element | null, trigger: Element | null, vars: gsap.TweenVars = {}) {
  if (!target || !trigger) return;

  gsap.fromTo(
    target,
    { y: 42 },
    {
      y: 0,
      ease: 'power3.out',
      ...vars,
      scrollTrigger: {
        trigger,
        start: 'top 88%',
        end: 'top 48%',
        scrub: 1.2,
      },
    },
  );
}

function cinematicFrameMotion(trigger: Element, frame: HTMLElement, direction = 1, scrub = 1.8) {
  const windowElement = one<HTMLElement>(frame, '.image-window');
  const image = one<HTMLImageElement>(frame, 'img');
  const sheen = one<HTMLElement>(frame, '[data-motion="image-sheen"]');
  const caption = one<HTMLElement>(frame, '.image-caption');
  if (!windowElement || !image) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 90%',
      end: 'top 28%',
      scrub,
    },
  });

  timeline
    .fromTo(
      frame,
      { y: 72, rotateZ: direction * 2.4, scale: 0.96 },
      { y: 0, rotateZ: 0, scale: 1, ease: 'power3.inOut', duration: 0.58 },
      0,
    )
    .fromTo(
      windowElement,
      { scale: 0.9, rotateY: direction * 5, transformOrigin: direction > 0 ? '0% 100%' : '100% 100%' },
      { scale: 1, rotateY: 0, ease: 'power3.inOut', duration: 0.62 },
      0,
    )
    .fromTo(
      image,
      { scale: 1.2, xPercent: -direction * 6, yPercent: 8 },
      { scale: 1.04, xPercent: direction * 3, yPercent: -4, ease: 'none', duration: 0.86 },
      0,
    )
    .fromTo(
      sheen,
      { xPercent: direction > 0 ? -180 : 180, opacity: 0 },
      { xPercent: direction > 0 ? 240 : -240, opacity: 0.72, ease: 'power1.inOut', duration: 0.78 },
      0.12,
    )
    .fromTo(
      caption,
      { y: 18, scale: 0.98 },
      { y: 0, scale: 1, ease: 'power3.out', duration: 0.28 },
      0.32,
    );
}

function setupHomeMotion(root: HTMLElement, desktop: boolean) {
  const cover = one<HTMLElement>(root, '[data-motion="cover"]');
  if (cover) {
    const loadIn = [
      one(cover, '[data-motion="cover-meta"]'),
      one(cover, '[data-motion="cover-copy"]'),
      one(cover, '[data-motion="cover-plate"]'),
      one(cover, '[data-motion="cover-strip"]'),
    ].filter(Boolean);

    gsap.from(loadIn, {
      y: 28,
      scale: 0.985,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power4.out',
      clearProps: 'transform,opacity',
    });

    if (desktop) {
      const copy = one(cover, '[data-motion="cover-copy"]');
      const title = one(cover, '[data-motion="cover-title"]');
      const plate = one(cover, '[data-motion="cover-plate"]');
      const image = one(cover, '[data-motion="cover-image"]');
      const plateRoot = plate instanceof HTMLElement ? plate : cover;
      const plateFrame = one<HTMLElement>(plateRoot, '.image-frame');
      const sheen = one<HTMLElement>(plateFrame ?? cover, '[data-motion="image-sheen"]');
      const titleParts = title ? many<HTMLElement>(title as HTMLElement, 'h1 > span, h1 > em') : [];
      const meta = one(cover, '[data-motion="cover-meta"]');
      const strip = one(cover, '[data-motion="cover-strip"]');
      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: cover,
          start: 'top top',
          end: 'top -80%',
          scrub: 1.8,
        },
      });

      scene
        .to(titleParts[0], { xPercent: -12, yPercent: -22, rotateZ: -2.5, ease: 'power2.inOut', duration: 0.64 }, 0)
        .to(titleParts[1], { xPercent: 9, yPercent: -30, rotateZ: 2.5, ease: 'power2.inOut', duration: 0.7 }, 0.02)
        .to(copy, { yPercent: -16, skewY: -1.5, ease: 'power2.inOut', duration: 0.72 }, 0.04)
        .to(plate, { yPercent: -7, rotateZ: -1.2, scale: 1.05, ease: 'power2.inOut', duration: 0.8 }, 0)
        .to(plateFrame, { rotateY: -2, scale: 1.02, ease: 'power2.inOut', duration: 0.72 }, 0.02)
        .to(image, { scale: 1.2, xPercent: -5, yPercent: -7, rotateZ: 1.2, ease: 'power2.inOut', duration: 0.82 }, 0)
        .to(sheen, { xPercent: 220, opacity: 0.78, ease: 'power1.inOut', duration: 0.68 }, 0.16)
        .to(meta, { yPercent: -80, xPercent: -4, ease: 'power2.inOut', duration: 0.5 }, 0.18)
        .to(strip, { yPercent: -24, xPercent: 2, ease: 'power2.inOut', duration: 0.58 }, 0.28);
    } else {
      revealOnScroll(one(cover, '[data-motion="cover-copy"]'), cover);
      const frame = one<HTMLElement>(cover, '[data-motion="cover-plate"] .image-frame');
      if (frame) cinematicFrameMotion(cover, frame, 1, 1.4);
    }
  }

  const profile = one<HTMLElement>(root, '[data-motion="profile"]');
  if (profile) {
    revealOnScroll(one(profile, '[data-motion="profile-heading"]'), profile, { y: 34 });
    revealOnScroll(one(profile, '[data-motion="profile-copy"]'), profile, { y: 56 });
    const portraitFrame = one<HTMLElement>(profile, '[data-motion="profile-portrait"] .image-frame');
    if (portraitFrame) cinematicFrameMotion(profile, portraitFrame, -1, 1.8);
  }

  const archive = one<HTMLElement>(root, '[data-motion="archive"]');
  if (archive) {
    revealOnScroll(one(archive, '[data-motion="archive-intro"]'), archive, { y: 38 });
    many<HTMLElement>(archive, '[data-motion="project-plate"]').forEach((plate, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const frame = one<HTMLElement>(plate, '.image-frame');
      const label = one<HTMLElement>(plate, '.project-plate__label');
      const arrow = one<HTMLElement>(plate, '.arrow-icon');
      if (frame) cinematicFrameMotion(plate, frame, direction, 1.9);
      gsap.fromTo(
        plate,
        { x: direction * 72, y: 84, rotateZ: direction * 3.2, scale: 0.97 },
        {
          x: 0,
          y: 0,
          rotateZ: 0,
          scale: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: plate, start: 'top 94%', end: 'top 40%', scrub: 1.9 },
        },
      );
      gsap.fromTo(
        label,
        { x: direction * 28, y: 18, skewX: direction * -2, scaleX: 0.98 },
        {
          x: 0,
          y: 0,
          skewX: 0,
          scaleX: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: plate, start: 'top 82%', end: 'top 42%', scrub: 1.5 },
        },
      );
      gsap.fromTo(
        arrow,
        { x: direction * -24, rotate: direction * -18, scale: 0.88 },
        {
          x: 0,
          rotate: 0,
          scale: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: plate, start: 'top 78%', end: 'top 42%', scrub: 1.2 },
        },
      );
    });
  }

  const tools = one<HTMLElement>(root, '[data-motion="tools"]');
  if (tools) {
    revealOnScroll(one(tools, '[data-motion="tools-heading"]'), tools, { y: 40 });
    const register = one(tools, '[data-motion="tools-register"]');
    if (register) {
      gsap.fromTo(
        register,
        { xPercent: desktop ? 18 : 0, y: desktop ? 0 : 36 },
        {
          xPercent: 0,
          y: 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: tools, start: 'top 82%', end: 'top 36%', scrub: 1.2 },
        },
      );
      gsap.fromTo(
        many<HTMLElement>(register as HTMLElement, '[data-motion="tool-chip"]'),
        { y: 42, rotateX: -68, scale: 0.92, transformOrigin: '50% 100%' },
        {
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: tools, start: 'top 78%', end: 'top 34%', scrub: 1.6 },
        },
      );
    }
  }

  const contact = one<HTMLElement>(root, '[data-motion="contact"]');
  if (contact) {
    revealOnScroll(one(contact, '[data-motion="contact-copy"]'), contact, { y: 46 });
    revealOnScroll(one(contact, '[data-motion="contact-details"]'), contact, { y: 28 });
  }
}

function setupProjectMotion(root: HTMLElement, desktop: boolean) {
  const hero = one<HTMLElement>(root, '[data-motion="case-hero"]');
  if (hero) {
    const loadIn = [
      one(hero, '[data-motion="case-meta"]'),
      one(hero, '[data-motion="case-copy"]'),
      one(hero, '[data-motion="case-image"]'),
    ].filter(Boolean);
    gsap.from(loadIn, {
      y: 28,
      scale: 0.985,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power4.out',
      clearProps: 'transform,opacity',
    });

    const copy = one(hero, '[data-motion="case-copy"]');
    const image = one(hero, '[data-motion="case-image"]');
    const imageElement = one(hero, '[data-motion="case-hero-image"]');
    const sheen = one<HTMLElement>(hero, '[data-motion="case-image"] [data-motion="image-sheen"]');
    const heroTitle = one(hero, '[data-motion="case-copy"] h1');
    const meta = one(hero, '[data-motion="case-meta"]');

    if (desktop) {
      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'top -70%',
          scrub: 1.8,
        },
      });
      scene
        .to(heroTitle, { xPercent: -9, yPercent: -18, rotateZ: -1.8, ease: 'power2.inOut', duration: 0.7 }, 0)
        .to(copy, { yPercent: -16, skewY: -1.2, ease: 'power2.inOut', duration: 0.74 }, 0.03)
        .to(image, { yPercent: -7, rotateZ: 1.2, scale: 1.06, ease: 'power2.inOut', duration: 0.78 }, 0)
        .to(imageElement, { scale: 1.2, xPercent: -5, yPercent: -5, rotateZ: -1.4, ease: 'none', duration: 0.84 }, 0)
        .to(sheen, { xPercent: 230, opacity: 0.76, ease: 'power1.inOut', duration: 0.7 }, 0.18)
        .to(meta, { yPercent: -80, xPercent: -4, ease: 'power2.inOut', duration: 0.5 }, 0.2);
    } else {
      revealOnScroll(copy, hero, { y: 34 });
      const frame = one<HTMLElement>(hero, '[data-motion="case-image"]');
      if (frame) cinematicFrameMotion(hero, frame, 1, 1.4);
    }
  }

  const intro = one<HTMLElement>(root, '[data-motion="case-intro"]');
  if (intro) {
    revealOnScroll(one(intro, '[data-motion="intro-index"]'), intro, { y: 22 });
    revealOnScroll(one(intro, '[data-motion="intro-copy"]'), intro, { y: 46 });
    revealOnScroll(one(intro, '[data-motion="intro-tags"]'), intro, { y: 28 });
  }

  const chapterIndex = one<HTMLElement>(root, '[data-motion="chapter-index"]');
  const chapters = many<HTMLElement>(root, '[data-motion="chapter"]');
  if (chapterIndex) {
    many<HTMLAnchorElement>(chapterIndex, 'a').forEach((link) => {
      revealOnScroll(link, chapterIndex, { y: 18 });
    });
  }

  chapters.forEach((chapter) => {
    const chapterId = chapter.dataset.chapter;
    const link = chapterId ? one<HTMLAnchorElement>(root, `[data-chapter-link="${chapterId}"]`) : null;
    const heading = one(chapter, '[data-motion="chapter-heading"]');
    const body = one(chapter, '[data-motion="chapter-body"]');
    const images = many<HTMLElement>(chapter, '[data-motion="chapter-image"]');
    const imageElements = many<HTMLElement>(chapter, '[data-motion="chapter-image-element"]');
    const sheens = many<HTMLElement>(chapter, '[data-motion="image-sheen"]');
    const layout = chapter.dataset.motionLayout;

    if (link) {
      ScrollTrigger.create({
        trigger: chapter,
        start: 'top 70%',
        end: 'top 30%',
        onToggle: (self) => link.classList.toggle('is-active', self.isActive),
      });
    }

    if (!desktop) {
      revealOnScroll(heading, chapter, { y: 32 });
      revealOnScroll(body, chapter, { y: 42 });
      images.forEach((image, index) => cinematicFrameMotion(chapter, image, index % 2 === 0 ? 1 : -1, 1.35));
      return;
    }

    const scene = gsap.timeline({
      scrollTrigger: {
        trigger: chapter,
        start: 'top 88%',
        end: 'top 18%',
        scrub: 1.8,
      },
    });

    scene
      .fromTo(heading, { xPercent: -10, yPercent: 8, rotateZ: -1.5, scale: 0.98 }, { xPercent: 0, yPercent: 0, rotateZ: 0, scale: 1, ease: 'power3.inOut', duration: 0.48 }, 0)
      .fromTo(body, { y: 48, scale: 0.98 }, { y: 0, scale: 1, ease: 'power3.out', duration: 0.38 }, 0.12);

    if (layout === 'diagram') {
      scene
        .fromTo(images, { xPercent: 14, scale: 1.1, rotateZ: 1.4 }, { xPercent: 0, scale: 1, rotateZ: 0, ease: 'power2.inOut', duration: 0.64 }, 0.12)
        .fromTo(imageElements, { scale: 1.2, xPercent: -8, yPercent: 6 }, { scale: 1.04, xPercent: 3, yPercent: -3, ease: 'none', duration: 0.76 }, 0.1);
    } else if (layout === 'gallery') {
      scene
        .fromTo(images[0], { y: 56, scale: 0.88, rotateZ: -1.2 }, { y: 0, scale: 1, rotateZ: 0, ease: 'power2.out', duration: 0.56 }, 0.1)
        .fromTo(images.slice(1), { y: 72, xPercent: 8, scale: 0.96 }, { y: 0, xPercent: 0, scale: 1, ease: 'power2.out', duration: 0.48, stagger: 0.08 }, 0.26)
        .fromTo(imageElements, { scale: 1.16, yPercent: 5 }, { scale: 1.04, yPercent: -3, ease: 'none', duration: 0.78 }, 0.12);
    } else if (layout === 'split') {
      scene
        .fromTo(images, { xPercent: 12, rotateY: 5, scale: 0.96 }, { xPercent: 0, rotateY: 0, scale: 1, ease: 'power2.out', duration: 0.58 }, 0.12)
        .fromTo(imageElements, { scale: 1.18, xPercent: -8, yPercent: 5 }, { scale: 1.04, xPercent: 3, yPercent: -3, ease: 'none', duration: 0.74 }, 0.1);
    } else {
      scene
        .fromTo(images, { y: 38, rotateZ: -1.2, scale: 0.96 }, { y: 0, rotateZ: 0, scale: 1, ease: 'power2.inOut', duration: 0.66 }, 0.1)
        .fromTo(imageElements, { scale: 1.18, xPercent: -6, yPercent: 6 }, { scale: 1.04, xPercent: 3, yPercent: -4, ease: 'none', duration: 0.78 }, 0.1);
    }

    scene
      .fromTo(sheens, { xPercent: -180, opacity: 0 }, { xPercent: 230, opacity: 0.76, ease: 'power1.inOut', duration: 0.7, stagger: 0.08 }, 0.18)
      .to(imageElements, { scale: 1.08, xPercent: 5, yPercent: -6, rotateZ: 0.6, ease: 'none', duration: 0.72 }, 0.4);
  });

  const navigation = one<HTMLElement>(root, '[data-motion="project-nav"]');
  if (navigation) {
    revealOnScroll(one(navigation, '[data-motion="project-nav-index"], .section-index'), navigation, { y: 28 });
    many<HTMLElement>(navigation, '[data-motion="project-transition"]').forEach((transition, index) => {
      revealOnScroll(transition, navigation, { y: 44, x: index === 0 ? -20 : 20 });
      const frame = one<HTMLElement>(transition, '.image-frame');
      if (frame) cinematicFrameMotion(navigation, frame, index === 0 ? -1 : 1, 1.5);
    });
  }
}

export function useCinematicMotion(scopeRef: RefObject<HTMLElement | null>, page: MotionPage, routeKey: string) {
  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root) return undefined;

    root.classList.add('motion-ready');
    let media: ReturnType<typeof gsap.matchMedia> | undefined;
    const context = gsap.context(() => {
      media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        root.classList.add('motion-reduced');
      });

      media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        if (page === 'home') setupHomeMotion(root, true);
        else setupProjectMotion(root, true);
      });

      media.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        if (page === 'home') setupHomeMotion(root, false);
        else setupProjectMotion(root, false);
      });
    }, root);

    let active = true;
    requestAnimationFrame(() => {
      if (active) ScrollTrigger.refresh();
    });
    document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      media?.revert();
      context.revert();
      clearMotionStyles(root);
      root.classList.remove('motion-ready', 'motion-reduced');
    };
  }, [page, routeKey, scopeRef]);
}
