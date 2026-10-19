import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { parse } from 'graphql';

const pagesFile = new URL('./sitecore-pages.json', import.meta.url);
const port = 3311;

const jsonResponse = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
};

const readJson = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
};

// Dictionary phrases mirror the serialized fr-CA dictionary items; no ja-JP phrases exist, so
// ja-JP (like any other language without phrases) falls back to English, as the site's
// language fallback settings do.
const dictionaries = {
  en: [{ key: 'Book Tickets', value: 'Book Tickets' }],
  'fr-CA': [
    { key: 'Book Tickets', value: 'Réservez vos billets' },
    { key: 'Get Tickets', value: 'Obtenir des billets' },
    { key: 'More Information', value: "Plus d'information" },
    { key: 'Featured Event', value: 'Événement en vedette' },
  ],
};

// The serialized redirect map is empty. These synthetic entries exercise the RedirectsProxy contract.
const redirects = [
  {
    pattern: '/old-sessions',
    target: '/sessions',
    redirectType: 'REDIRECT_301',
    isQueryStringPreserved: true,
    isLanguagePreserved: true,
    locale: '',
  },
  {
    pattern: '/summit-news',
    target: '/news',
    redirectType: 'REDIRECT_302',
    isQueryStringPreserved: false,
    isLanguagePreserved: true,
    locale: '',
  },
  {
    pattern: '/legacy-speakers',
    target: '/speakers',
    redirectType: 'SERVER_TRANSFER',
    isQueryStringPreserved: false,
    isLanguagePreserved: true,
    locale: '',
  },
  {
    pattern: '/shop/old-sessions',
    target: '/sessions',
    redirectType: 'REDIRECT_301',
    isQueryStringPreserved: false,
    isLanguagePreserved: true,
    locale: '',
  },
];

// Runtime page-title overrides make ISR revalidation observable without editing fixture files.
const titleOverrides = new Map();

// Item language fallback: a page without a translation is served in the requested language with
// the English field values (the site enables item and field language fallback).
const localize = (page, language) => {
  if (!page) return null;
  const { translations = {}, ...english } = page;
  const localized = structuredClone(translations[language] ?? english);
  if (language && language !== 'en') {
    localized.sitecore.context.language = language;
    if (localized.sitecore.route) localized.sitecore.route.itemLanguage = language;
  }
  return localized;
};

// Edge personalize stand-in. CDP audience evaluation is replaced by a deterministic rule keyed to
// the UTM conditions of the existing definitions; it never returns a variant the request did not offer.
const personalizeRequests = [];
let browserCounter = 0;
const campaignVariants = {
  demoexample: 'ee12ae1fa982465598b5d270b963b1d6', // "From a specific campaign"
  'sessions-fans': 'b5885a5c1dd14dd1b9059910332827f6', // stand-in for "Visited a specific page"
  slow: 'ee12ae1fa982465598b5d270b963b1d6',
};

// Mirror upstream layout behavior for editing/preview of a selected page variant.
const applyEditingVariant = (components, variantId, editing) =>
  components.flatMap((component) => {
    let current = component;
    if (component.experiences) {
      const variant = component.experiences[variantId];
      current = variant ? { ...variant } : { ...component };
      current.experiences = {};
      if (!current.componentName) {
        if (!editing) return [];
        current = { ...current, componentName: 'Hidden Rendering' };
      }
    }
    if (current.placeholders) {
      current.placeholders = Object.fromEntries(
        Object.entries(current.placeholders).map(([name, list]) => [
          name,
          applyEditingVariant(list, variantId, editing),
        ])
      );
    }
    return [current];
  });

const getArgument = (field, name, variables) => {
  const argument = field.arguments?.find((value) => value.name.value === name)?.value;
  return argument?.kind === 'Variable' ? variables[argument.name.value] : argument?.value;
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (url.pathname === '/health') {
    return jsonResponse(response, 200, { status: 'fixture-ready' });
  }
  if (url.pathname === '/-/play-logo.svg') {
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    return response.end(
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="5" y="28" font-family="Arial, sans-serif">PLAY! Summit</text></svg>'
    );
  }
  if (url.pathname === '/__fixture/page-title') {
    if (request.method === 'DELETE') titleOverrides.clear();
    if (request.method === 'POST') {
      const { path, title } = await readJson(request);
      titleOverrides.set(path, title);
    }
    return jsonResponse(response, 200, Object.fromEntries(titleOverrides));
  }
  if (url.pathname === '/sitemap-1.xml') {
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    return response.end(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        '<url><loc>http://localhost:3310/</loc></url><url><loc>http://localhost:3310/sessions</loc></url></urlset>'
    );
  }
  if (url.pathname === '/__fixture/personalize-requests') {
    if (request.method === 'DELETE') personalizeRequests.length = 0;
    return jsonResponse(response, 200, personalizeRequests);
  }
  if (request.method === 'GET' && url.pathname === '/v1/events/v1.2/browser/create.json') {
    browserCounter += 1;
    return jsonResponse(response, 200, { ref: `fixture-server-browser-${browserCounter}` });
  }
  const profile = url.pathname.match(/^\/v1\/events\/v1\.2\/browser\/([^/]+)\/show\.json$/);
  if (request.method === 'GET' && profile) {
    return jsonResponse(response, 200, { customer: { ref: `fixture-guest-${profile[1]}` } });
  }
  if (request.method === 'POST' && url.pathname === '/v1/personalize') {
    const body = await readJson(request);
    personalizeRequests.push({
      siteId: url.searchParams.get('siteId'),
      contextId: request.headers['x-sitecore-contextid'],
      body,
    });
    const campaign = body.params?.utm?.campaign;
    if (campaign === 'fail') return jsonResponse(response, 503, { error: 'unavailable' });
    if (campaign === 'slow') await new Promise((resolve) => setTimeout(resolve, 1_500));
    const variantId = campaignVariants[campaign];
    return jsonResponse(
      response,
      200,
      variantId && body.variants?.includes(variantId) ? { variantId } : {}
    );
  }
  // Local CM GraphQL and the Edge content GraphQL path share the same fixture protocol.
  const graphQLPaths = ['/sitecore/api/graph/edge', '/v1/content/api/graphql/v1'];
  if (request.method !== 'POST' || !graphQLPaths.includes(url.pathname)) {
    // Record unexpected server-side calls (for example Edge personalize/analytics) as evidence.
    console.log(`[fixture] unhandled ${request.method} ${url.pathname}`);
    return jsonResponse(response, 404, { error: 'Unknown fixture endpoint' });
  }

  try {
    const { query, variables = {} } = await readJson(request);
    const document = parse(query);
    const operation = document.definitions.find(
      (definition) => definition.kind === 'OperationDefinition'
    );
    const data = {};
    for (const field of operation.selectionSet.selections) {
      const key = field.alias?.value || field.name.value;
      if (field.name.value === 'site') {
        data[key] = {
          siteInfoCollection: [{ name: 'playwebsite', hostName: '*', language: 'en' }],
          siteInfo: {
            dictionary: {
              pageInfo: { endCursor: '', hasNext: false },
              results: dictionaries[variables.language] ?? dictionaries.en,
            },
            redirects,
            robots: 'User-agent: *\nDisallow: /api/\nSitemap: http://localhost:3310/sitemap.xml',
            sitemap: ['http://127.0.0.1:3311/sitemap-1.xml'],
          },
        };
      } else if (field.name.value === 'layout') {
        const pages = JSON.parse(await readFile(pagesFile, 'utf8'));
        const path = getArgument(field, 'routePath', variables) || '/';
        const language = getArgument(field, 'language', variables);
        // Unique per-run probe paths (for example /isr-probe-<id>) reuse the probe templates so ISR
        // checks always start from a never-rendered route.
        const probe = path.match(/^\/(isr|fallback)-probe-[\w-]+$/);
        const source = pages[path] ?? (probe ? pages[`/${probe[1]}-probe`] : undefined);
        const { personalizeVariantIds, ...page } = localize(source, language) ?? {};
        if (titleOverrides.has(path) && page.sitecore?.route) {
          page.sitecore.route.fields = {
            ...page.sitecore.route.fields,
            pageTitle: { value: titleOverrides.get(path) },
          };
        }
        // Layout and personalize-info queries share this field. Extra fields are ignored by clients.
        data[key] = {
          item: page.sitecore
            ? {
                rendered: page,
                id: page.sitecore.route?.itemId,
                version: page.sitecore.route?.itemVersion ?? 1,
                personalization: { variantIds: personalizeVariantIds ?? [] },
              }
            : null,
        };
      } else if (field.name.value === 'item') {
        const pages = JSON.parse(await readFile(pagesFile, 'utf8'));
        const itemId = getArgument(field, 'path', variables);
        const found =
          Object.values(pages).find((page) => page.sitecore.route?.itemId === itemId) ||
          pages[itemId] ||
          null;
        const language = getArgument(field, 'language', variables);
        const rendered =
          found && (({ personalizeVariantIds, ...layout }) => layout)(localize(found, language));
        if (rendered && operation.name?.value === 'EditingQuery') {
          // Match the public local-CM editing GraphQL protocol used by the SDK.
          // Metadata markers alone do not imply a normalized editing Page mode.
          const editing = request.headers.sc_editmode === 'true';
          const preview = request.headers.sc_previewmode === 'true';
          rendered.sitecore.context.pageEditing = editing;
          rendered.sitecore.context.pageState = editing ? 'edit' : preview ? 'preview' : 'normal';
          rendered.sitecore.context.editMode = 'metadata';
          // Upstream editing layout is already personalized for the selected (or default) variant.
          const variantId = request.headers.sc_variant || 'default';
          if (rendered.sitecore.route?.placeholders) {
            const route = rendered.sitecore.route;
            route.placeholders = Object.fromEntries(
              Object.entries(route.placeholders).map(([name, list]) => [
                name,
                applyEditingVariant(list, variantId, editing),
              ])
            );
            if (variantId !== 'default') rendered.sitecore.context.variantId = variantId;
          }
        }
        data[key] = { rendered };
      } else {
        return jsonResponse(response, 400, {
          errors: [{ message: `Fixture does not implement query field: ${field.name.value}` }],
        });
      }
    }
    return jsonResponse(response, 200, { data });
  } catch (error) {
    return jsonResponse(response, 400, { errors: [{ message: error.message }] });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sitecore fixture listening on http://127.0.0.1:${port}`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
