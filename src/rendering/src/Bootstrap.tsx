import { useEffect } from 'react';
import { SitecorePageProps, initContentSdk } from '@sitecore-content-sdk/nextjs';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { analyticsBrowserAdapter, analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import config from 'sitecore.config';

const Bootstrap = ({ page }: SitecorePageProps): null => {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' ||
      !page?.mode.isNormal ||
      !config.api.edge.clientContextId
    )
      return;
    initContentSdk({
      config: {
        contextId: config.api.edge.clientContextId,
        edgeUrl: config.api.edge.edgeUrl,
        siteName: page.siteName || config.defaultSite,
      },
      plugins: [
        analyticsPlugin({
          options: {
            enableCookie: true,
            cookieDomain: window.location.hostname.replace(/^www\./, ''),
          },
          adapter: analyticsBrowserAdapter(),
        }),
        eventsPlugin(),
      ],
    }).catch(() => console.debug('Native analytics initialization unavailable.'));
  }, [page?.siteName, page?.mode.isNormal]);
  return null;
};
export default Bootstrap;
