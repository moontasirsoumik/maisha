import type { Plate } from '../content/types';

type Props = {
  plate: Plate;
  eager?: boolean;
  onOpen?: (plate: Plate) => void;
  className?: string;
};

export function PlateView({ plate, eager = false, onOpen, className }: Props) {
  const frame = (
    <figure className={className ? `plate ${className}` : 'plate'}>
      <div className="plate-frame">
        <img
          src={plate.src}
          alt={plate.alt}
          width={plate.width}
          height={plate.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
        />
      </div>
      <figcaption>{plate.caption}</figcaption>
    </figure>
  );

  if (!onOpen) return frame;

  return (
    <button className="plate-button" type="button" onClick={() => onOpen(plate)}>
      {frame}
      <span className="sr-only">Open {plate.caption}</span>
    </button>
  );
}
