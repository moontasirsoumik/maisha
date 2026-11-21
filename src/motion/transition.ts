export const PLATE_KEY = 'maisha-plate';

const reduceQuery = '(prefers-reduced-motion: reduce)';

export function motionAllowed() {
  return !window.matchMedia(reduceQuery).matches;
}

export function viewTransitionAllowed() {
  return motionAllowed() && 'startViewTransition' in document;
}

type ViewTransitionLike = {
  finished: Promise<void>;
};

export function runTransition(update: () => void): ViewTransitionLike | null {
  if (!viewTransitionAllowed()) {
    update();
    return null;
  }
  const root = document.documentElement;
  root.classList.add('is-turning');
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);
  const veil = document.createElement('div');
  veil.className = 'page-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  const transition = document.startViewTransition(() => {
    update();
  });
  const clear = () => {
    root.classList.remove('is-turning');
    curtain.remove();
    veil.remove();
  };
  transition.finished.finally(clear);
  window.setTimeout(clear, 1400);
  return transition;
}
