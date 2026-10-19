// Test-harness guard, preloaded with NODE_OPTIONS for the rendering host under test.
// Server-side fetches may only reach loopback fixtures; anything else is logged and refused,
// so synthetic test configuration can never be sent to a live Sitecore service.
const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const originalFetch = globalThis.fetch;

if (typeof originalFetch === 'function' && !originalFetch.__loopbackOnly) {
  const guardedFetch = async (input, init) => {
    const href = typeof input === 'string' ? input : (input?.url ?? String(input));
    let url;
    try {
      url = new URL(href);
    } catch {
      return originalFetch(input, init);
    }
    if (!loopbackHosts.has(url.hostname)) {
      console.error(`[loopback-only] blocked server-side request to ${url.origin}`);
      throw new TypeError(`Blocked non-loopback request to ${url.origin}`);
    }
    return originalFetch(input, init);
  };
  guardedFetch.__loopbackOnly = true;
  globalThis.fetch = guardedFetch;
}
