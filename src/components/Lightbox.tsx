import { useEffect, useRef, type DialogHTMLAttributes } from 'react';
import type { Plate } from '../content/types';

type Props = {
  plate: Plate | null;
  onClose: () => void;
};

export function Lightbox({ plate, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (plate && !dialog.open) dialog.showModal();
    if (!plate && dialog.open) dialog.close();
  }, [plate]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside) onClose();
    };
    const onCloseEvent = () => onClose();

    dialog.addEventListener('click', onClick);
    dialog.addEventListener('close', onCloseEvent);
    return () => {
      dialog.removeEventListener('click', onClick);
      dialog.removeEventListener('close', onCloseEvent);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={plate?.caption ?? 'Plate'}
      {...({ closedby: 'any' } as DialogHTMLAttributes<HTMLDialogElement>)}
    >
      {plate ? (
        <div className="lightbox-sheet">
          <img
            src={plate.full}
            alt={plate.alt}
            width={plate.width}
            height={plate.height}
            decoding="async"
          />
          <div className="lightbox-bar">
            <p>{plate.caption}</p>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
