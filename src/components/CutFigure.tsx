import type { CSSProperties } from 'react';
import type { Cutout } from '../content/projects';

/**
 * An object lifted off its sheet: it rises out of a paper tile, or floats above the page without one.
 * A floating object casts its own silhouette as a shadow on the paper and tilts on `--mx`/`--my` (−1 to 1).
 */
export function CutFigure({ cut, className, eager }: { cut: Cutout; className?: string; eager?: boolean }) {
  const classes = ['cut', cut.tile ? 'cut-tiled' : 'cut-float', className].filter(Boolean).join(' ');
  const loading = eager ? 'eager' : 'lazy';
  const image = (
    <img
      src={cut.src}
      alt={cut.alt}
      width={cut.width}
      height={cut.height}
      loading={loading}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      data-float
    />
  );
  return (
    <figure
      className={classes}
      style={{ aspectRatio: `${cut.width} / ${cut.height}`, '--tile': cut.tile } as CSSProperties}
      data-rise>
      {cut.tile ? (
        <>
          <span className="cut-tile" aria-hidden="true" />
          {image}
        </>
      ) : (
        <>
          <img className="cut-shadow" src={cut.src} alt="" aria-hidden="true" loading={loading} decoding="async" />
          <span className="cut-body">{image}</span>
        </>
      )}
    </figure>
  );
}
