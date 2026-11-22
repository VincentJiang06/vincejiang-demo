// Metadata helpers: derive descriptions from published text, never invent claims.
export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const jsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');
export function metadata({title, description, url, image, type='website', data}) {
 return `<meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(url)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:type" content="${type}">${image?`<meta property="og:image" content="${esc(image)}">`:''}<meta name="twitter:card" content="${image?'summary_large_image':'summary'}"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">${data?`<script type="application/ld+json">${jsonLd(data)}</script>`:''}`;
}

// Explicit extensionless routes served by docker/site.conf; other directory URLs retain '/'.
const extensionlessRoutes = new Map([
 ['/netstall/index.html', '/netstall'],
]);
export const publicPagePath = filePath => extensionlessRoutes.get(filePath) ?? filePath.replace(/index\.html$/, '');

// These paths return 410 in production, including files still built for local use.
const retiredMainPaths = new Set(['S16-prediction', 'sound_dashboard']);
export function isRetiredMainPath(pathname) {
  return retiredMainPaths.has(pathname.split('/')[1]);
}
