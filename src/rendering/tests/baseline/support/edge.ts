import { BrowserContext } from '@playwright/test';

export const edgeOrigin = 'https://edge-platform.sitecorecloud.io';
export const syntheticContextId = 'local-fixture-client-context';

export type EdgeEvent = { url: string; contextId?: string; body: Record<string, unknown> };
export type EdgeOptions = { eventDelayMs?: number; failAll?: boolean };

// The Edge platform is the external network boundary. It is simulated in the browser context;
// no request leaves the machine and every other non-loopback request is refused.
export const simulateEdge = async (context: BrowserContext, options: EdgeOptions = {}) => {
  const events: EdgeEvent[] = [];
  const clientIdRequests: string[] = [];
  let browserCounter = 0;
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
  await context.route(`${edgeOrigin}/v1/events/v1.2/**`, async (route) => {
    const request = route.request();
    if (options.failAll) return route.fulfill({ status: 503, json: { error: 'unavailable' } });
    if (request.url().includes('/browser/create.json')) {
      clientIdRequests.push(request.url());
      browserCounter += 1;
      return route.fulfill({ json: { ref: `fixture-browser-${browserCounter}` } });
    }
    events.push({
      url: request.url(),
      contextId: request.headers()['x-sitecore-contextid'],
      body: request.postDataJSON(),
    });
    if (options.eventDelayMs) await new Promise((r) => setTimeout(r, options.eventDelayMs));
    return route.fulfill({ json: { ref: 'fixture-event' } }).catch((): void => undefined);
  });
  return { events, clientIdRequests };
};

export const eventsOfType = (events: EdgeEvent[], type: string) =>
  events.filter((event) => event.body.type === type);
