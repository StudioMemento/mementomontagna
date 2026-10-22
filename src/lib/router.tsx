import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
type RouterValue = { path: string; navigate: (to: string) => void };
const Router = createContext<RouterValue | null>(null);
export const normalizedPath = (path: string) => path.replace(/\/+$/, '') || '/';
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizedPath(window.location.pathname));
  useEffect(() => {
    const pop = () => { setPath(normalizedPath(window.location.pathname)); window.scrollTo(0, 0); };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const navigate = (to: string) => {
    const url = new URL(to, window.location.origin);
    const season = new URLSearchParams(window.location.search).get('season');
    if (season) url.searchParams.set('season', season);
    window.history.pushState({}, '', url);
    setPath(normalizedPath(url.pathname));
    if (url.hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
  return <Router.Provider value={{ path, navigate }}>{children}</Router.Provider>;
}
export function useRouter() {
  const value = useContext(Router);
  if (!value) throw new Error('RouterProvider required');
  return value;
}
export function Link({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter();
  return <a href={href} {...props} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    if (new URL(href, window.location.origin).origin !== window.location.origin || href.startsWith('#')) return;
    event.preventDefault(); navigate(href);
  }} />;
}
