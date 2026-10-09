import { useEffect, useState } from 'react';

/* Minimal hash router: "#/online/ABC123" -> { path: ['online', 'ABC123'] }. */
function parse() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, query = ''] = raw.split('?');
  return { path: pathPart.split('/').filter(Boolean), query: new URLSearchParams(query) };
}

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(to) {
  location.hash = to.startsWith('#') ? to : `#${to}`;
}
