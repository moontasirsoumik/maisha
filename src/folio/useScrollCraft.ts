import { useEffect } from 'react';

type ScrollCraftApi = { destroy: () => void; layout: () => void };

type ScrollCraftGlobal = {
  mount: (root: HTMLElement) => ScrollCraftApi;
};

export function useScrollCraft(root: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let api: ScrollCraftApi | null = null;
    let dead = false;

    const onScroll = () => {
      const vh = window.innerHeight || 1;
      node.querySelectorAll<HTMLElement>('[data-sc-travel]').forEach((act) => {
        const rect = act.getBoundingClientRect();
        const span = Math.max(rect.height - vh * 0.15, vh * 0.4);
        const p = Math.min(1, Math.max(0, (vh * 0.82 - rect.top) / span));
        act.style.setProperty('--sc-p', p.toFixed(4));
      });
    };

    const start = () => {
      const sc = (window as Window & { ScrollCraft?: ScrollCraftGlobal }).ScrollCraft;
      if (!sc || dead) return;
      api = sc.mount(node);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    };

    if ((window as Window & { ScrollCraft?: ScrollCraftGlobal }).ScrollCraft) start();
    else {
      const existing = document.querySelector<HTMLScriptElement>('script[data-scrollcraft]');
      if (existing) existing.addEventListener('load', start, { once: true });
      else {
        const script = document.createElement('script');
        script.src = '/vendor/scrollcraft.js';
        script.dataset.scrollcraft = '1';
        script.onload = start;
        document.body.appendChild(script);
      }
    }

    return () => {
      dead = true;
      window.removeEventListener('scroll', onScroll);
      api?.destroy();
    };
  }, [root, key]);
}
