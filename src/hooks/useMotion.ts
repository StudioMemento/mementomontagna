import { useEffect, type RefObject } from 'react';
export function useMotion(root: RefObject<HTMLElement | null>, route: string) {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      await document.fonts?.ready;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      const context = gsap.context(() => {
        media.add({ desktop: '(min-width: 1024px) and (pointer: fine)', motion: '(prefers-reduced-motion: no-preference)' }, ctx => {
          if (!ctx.conditions?.motion) return;
          root.current!.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
            gsap.from(el, { y: ctx.conditions?.desktop ? 24 : 10, opacity: 0, duration: ctx.conditions?.desktop ? .85 : .35, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
          });
          if (ctx.conditions.desktop) {
            const photo = root.current!.querySelector('.hero-photos');
            if (photo) gsap.fromTo(photo, { yPercent: 0, scale: 1.025 }, { yPercent: -2.5, scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .65 } });
          }
        });
      }, root);
      cleanup = () => { media.revert(); context.revert(); };
    })();
    return () => { disposed = true; cleanup?.(); };
  }, [root, route]);
}
