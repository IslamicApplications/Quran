import { useCallback, useEffect, useRef } from 'react';

// Open modals, innermost last, so Escape only closes the top one when modals are stacked
// (e.g. the comparison modal opened from the lesson drawer).
const stack: symbol[] = [];

/** True while any modal is open, so page-level shortcuts can stand down. */
export const isAnyModalOpen = () => stack.length > 0;

/**
 * Closes on Escape and locks page scroll while a modal is open.
 * Returns `isTopModal()`, for modals with their own keyboard shortcuts.
 */
export function useModalBehavior(isOpen: boolean, onClose?: () => void) {
  const id = useRef(Symbol('modal')).current;
  // Callers usually pass an inline onClose; keep the latest one without re-registering (which would reorder the stack)
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    stack.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack[stack.length - 1] === id) onCloseRef.current?.();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      stack.splice(stack.indexOf(id), 1);
      if (stack.length === 0) document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, id]);

  return useCallback(() => stack[stack.length - 1] === id, [id]);
}
