import { useEffect, useState, type RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Hook that returns whether an element is visible in the viewport using IntersectionObserver.
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {},
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef?.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry?.isIntersecting;
        setIsVisible(visible);
        if (visible && freezeOnceVisible) {
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return isVisible;
}
