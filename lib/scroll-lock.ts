type SavedBodyStyles = {
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
  paddingRight: string;
};

let lockCount = 0;
let savedStyles: SavedBodyStyles | null = null;
let savedScrollY = 0;

// Fixed-body locking keeps touch and wheel scrolling of the page blocked on iOS Safari,
// where `overflow: hidden` on body alone does not stop touchmove.
export function lockBodyScroll(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  if (lockCount === 0) {
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    savedScrollY = window.scrollY;
    savedStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    const currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0 || !savedStyles) return;

    const { body } = document;
    body.style.position = savedStyles.position;
    body.style.top = savedStyles.top;
    body.style.left = savedStyles.left;
    body.style.right = savedStyles.right;
    body.style.width = savedStyles.width;
    body.style.overflow = savedStyles.overflow;
    body.style.paddingRight = savedStyles.paddingRight;
    savedStyles = null;

    window.scrollTo(0, savedScrollY);
  };
}
