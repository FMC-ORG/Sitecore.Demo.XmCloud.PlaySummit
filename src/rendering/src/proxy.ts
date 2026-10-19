import { NextFetchEvent, NextRequest } from 'next/server';
import {
  defineProxy,
  MultisiteProxy,
  RedirectsProxy,
  PersonalizeProxy,
  PreviewProxy,
  BotTrackingProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';

const excluded = (request: NextRequest) =>
  /^\/(?:shop|account|search|channels|careconnect)(?:\/|$)/.test(request.nextUrl.pathname);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const preview = new PreviewProxy({ client, ...scConfig.api.edge });
  const bots = new BotTrackingProxy({ ...scConfig.api.edge, sites, fetchEvent: event });
  const multisite = new MultisiteProxy({
    sites,
    ...scConfig.api.edge,
    ...scConfig.multisite,
    skip: excluded,
  });
  const redirects = new RedirectsProxy({
    sites,
    ...scConfig.api.edge,
    ...scConfig.api.local,
    ...scConfig.redirects,
    skip: excluded,
  });
  const personalize = new PersonalizeProxy({
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    skip: excluded,
  });
  return defineProxy(preview, bots, multisite, redirects, personalize).exec(request);
}

export const config = {
  matcher: [
    '/',
    '/((?!api/|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg|feaas-render).*)',
  ],
};
