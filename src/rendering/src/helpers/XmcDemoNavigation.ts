const excludedRoots = new Set(['shop', 'account', 'search', 'channels', 'careconnect', 'auth']);
const excludedApiRoots = new Set([
  'auth',
  'cdp',
  'checkout',
  'openid-connect',
  'ordercloud',
  'private',
]);
const locales = new Set(['en', 'fr-ca', 'ja-jp']);

/** Keep retained CMS navigation without changing author-owned link items. */
export const isXmcDemoLink = (href = '#'): boolean => {
  try {
    const path = new URL(href, 'https://xmc-demo.invalid').pathname;
    const segments = path
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.toLowerCase());
    if (locales.has(segments[0])) segments.shift();
    return (
      !excludedRoots.has(segments[0]) &&
      !(segments[0] === 'api' && excludedApiRoots.has(segments[1]))
    );
  } catch {
    return false;
  }
};
