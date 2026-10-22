import { useEffect, useRef, type ReactNode } from 'react';
type Props = { open: boolean; onClose: () => void; labelledBy: string; className?: string; children: ReactNode };
export function Dialog({ open, onClose, labelledBy, className = '', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    opener.current = document.activeElement as HTMLElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const frame = requestAnimationFrame(() => {
      const target = dialog.querySelector<HTMLElement>('[data-autofocus]') || dialog.querySelector<HTMLElement>('button, input, select, a[href]');
      target?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      dialog.close();
      document.body.style.overflow = previous;
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={labelledBy} className={`dialog ${className}`} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    {children}
  </dialog>;
}
