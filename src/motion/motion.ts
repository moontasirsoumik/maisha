import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };

export const MOTION = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 60rem)';

if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

/** Puts a new page at the top before its scroll triggers measure anything. Call it before usePageMotion. */
export function usePageTop(key: string) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);
}

/**
 * Shared scroll motion for a page.
 *  [data-picture]  a frame that wipes open from below as it enters, its image settling from a slight zoom;
 *                  data-picture="flat" keeps the image at its true size, for drawings whose edges carry labels
 *  [data-drift]    an image inside an overflow-hidden frame that drifts against the scroll
 *  [data-float]    a cut-out object that rises against its tile as it crosses the viewport
 *  [data-ghost]    a faint background drawing that travels slower than the page; the value is its travel in percent
 *  [data-emerge]   a keyed picture that rises out of the paper as its band arrives
 *  [data-slide]    a drawing strip that drifts sideways across the scroll
 *  [data-scene]    a render in depth layers that part as it crosses the viewport, its sky word sinking behind
 *  [data-rise]     a block that lifts into place once; data-rise="group" staggers its children
 */
export function usePageMotion(scope: RefObject<HTMLElement | null>, key: string) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const root = scope.current;
        if (!root) return;

        gsap.utils.toArray<HTMLElement>('[data-picture]', root).forEach((frame) => {
          const image = frame.querySelector('img');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
          });
          tl.fromTo(
            frame,
            { clipPath: 'inset(18% 0% 0% 0%)', opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.3, ease: 'expo.out' },
          );
          if (image && frame.dataset.picture !== 'flat') {
            tl.fromTo(image, { scale: 1.18 }, { scale: 1.08, duration: 1.6, ease: 'expo.out' }, 0);
          }
        });

        gsap.utils.toArray<HTMLElement>('[data-drift]', root).forEach((image) => {
          const frame = image.parentElement ?? image;
          if (!image.closest('[data-picture]')) gsap.set(image, { scale: 1.08 });
          gsap.fromTo(
            image,
            { yPercent: -3.5 },
            {
              yPercent: 3.5,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-float]', root).forEach((object) => {
          gsap.fromTo(
            object,
            { yPercent: 5 },
            {
              yPercent: -5,
              ease: 'none',
              scrollTrigger: { trigger: object.parentElement ?? object, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-ghost]', root).forEach((plane) => {
          const travel = Number(plane.dataset.ghost) || 16;
          gsap.fromTo(
            plane,
            { yPercent: 0 },
            {
              yPercent: travel,
              ease: 'none',
              scrollTrigger: {
                trigger: plane.parentElement ?? plane,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-emerge]', root).forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: 16, scale: 1.06, opacity: 0.4 },
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: image.parentElement ?? image,
                start: 'top bottom',
                end: 'bottom 85%',
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-slide]', root).forEach((strip) => {
          gsap.fromTo(
            strip,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: strip.parentElement ?? strip,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-scene]', root).forEach((scene) => {
          const crop = Number(scene.dataset.scene) || 10;
          const word = scene.querySelector<HTMLElement>('[data-scene-word]');
          const layers = gsap.utils.toArray<HTMLElement>('[data-scene-layer]', scene);
          const nearest = Math.max(layers.length - 1, 1);

          const scroll = { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true };
          // Every layer rises, nearer ones further, and never past the crop, so no layer uncovers
          // its own copy in the layer behind it.
          layers.forEach((layer, depth) => {
            const travel = crop * (0.25 + (0.75 * depth) / nearest);
            gsap.fromTo(layer, { yPercent: 0 }, { yPercent: -travel, ease: 'none', scrollTrigger: scroll });
          });
          if (word) gsap.fromTo(word, { yPercent: -10 }, { yPercent: 55, ease: 'none', scrollTrigger: scroll });

          // Made after the scroll tweens, so reverting undoes it first and they never keep its offset.
          const enter = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 92%', once: true } });
          enter.from(layers, { y: 48, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0);
          if (word) enter.from(word, { y: 72, opacity: 0, duration: 1.8, ease: 'expo.out' }, 0.15);
        });

        gsap.utils.toArray<HTMLElement>('[data-rise]', root).forEach((block) => {
          const targets = block.dataset.rise === 'group' ? Array.from(block.children) : [block];
          gsap.from(targets, {
            y: 28,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: block, start: 'top 90%', once: true },
          });
        });
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  );
}
