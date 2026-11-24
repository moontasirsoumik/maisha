import type { CSSProperties } from 'react';
import type { Scene } from '../content/projects';

/** The frame crops this share off the bottom of the render, so nearer layers have room to rise. */
const CROP = 0.1;

/** A render taken apart in depth: a word in the sky, the buildings, then the ground nearest the eye. */
export function SceneBanner({ scene, alt }: { scene: Scene; alt: string }) {
  const shown = 1 - CROP - scene.trim;
  return (
    <figure
      className="scene"
      style={{ aspectRatio: `${scene.width} / ${Math.round(scene.height * shown)}` }}
      data-scene={CROP * 100}>
      <span
        className="scene-word"
        style={{ '--chars': scene.word.length, top: `${scene.wordTop * 100}%` } as CSSProperties}
        aria-hidden="true"
        data-scene-word>
        {scene.word}
      </span>
      {scene.layers.map((src, depth) => (
        <img
          className="scene-layer"
          style={{ top: `${(-scene.trim / shown) * 100}%` }}
          src={src}
          alt={depth === 0 ? alt : ''}
          width={scene.width}
          height={scene.height}
          fetchPriority={depth === 0 ? 'high' : undefined}
          decoding="async"
          data-scene-layer={depth}
          key={src}
        />
      ))}
    </figure>
  );
}
