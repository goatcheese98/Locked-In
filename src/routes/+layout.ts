// There is one local-only timer route; ship HTML, never an SSR service or SPA catch-all.
export const prerender = true;
export const trailingSlash = 'always';
