export const PLATE_KEY = 'maisha-plate';

const reduceQuery = '(prefers-reduced-motion: reduce)';

export function motionAllowed() {
  return !window.matchMedia(reduceQuery).matches && 'startViewTransition' in document;
}

type ViewTransitionLike = {
  finished: Promise<void>;
};

export function runTransition(update: () => void): ViewTransitionLike | null {
  if (!motionAllowed()) {
    update();
    return null;
  }
  return document.startViewTransition(update);
}
