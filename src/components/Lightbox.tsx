import { useEffect, useRef, type DialogHTMLAttributes } from 'react';
import type { Plate } from '../content/types';

type Props = {
  plates: Plate[];
  index: number | null;
  onIndex: (index: number | null) => void;
};

export function Lightbox({ plates, index, onIndex }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const plate = index === null ? null : plates[index];
  const count = plates.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (plate && !dialog.open) dialog.showModal();
    if (!plate && dialog.open) dialog.close();
  }, [plate]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => onIndex(null);
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) onIndex(null);
    };
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('click', onClick);
    return () => {
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('click', onClick);
    };
  }, [onIndex]);

  const step = (by: number) => {
    if (index === null) return;
    onIndex((index + by + count) % count);
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={plate?.caption ?? 'Drawing'}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') step(1);
        if (event.key === 'ArrowLeft') step(-1);
      }}
      {...({ closedby: 'any' } as DialogHTMLAttributes<HTMLDialogElement>)}
    >
      {plate ? (
        <div className="lightbox-sheet">
          <img
            key={plate.full}
            src={plate.full}
            alt={plate.alt}
            width={plate.width}
            height={plate.height}
            decoding="async"
          />
          <div className="lightbox-bar">
            <p>
              <span>{plate.caption}</span>
              <span className="lightbox-count">
                {index! + 1} of {count}
              </span>
            </p>
            <div className="lightbox-controls">
              {count > 1 ? (
                <>
                  <button type="button" onClick={() => step(-1)}>
                    Previous
                  </button>
                  <button type="button" onClick={() => step(1)}>
                    Next
                  </button>
                </>
              ) : null}
              <button type="button" onClick={() => onIndex(null)} autoFocus>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
