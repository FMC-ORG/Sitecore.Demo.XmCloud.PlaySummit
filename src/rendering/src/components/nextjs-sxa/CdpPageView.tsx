import { CdpHelper, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useEffect } from 'react';
import { pageView } from '@sitecore-content-sdk/events';
import config from 'sitecore.config';

const CdpPageView = (): React.JSX.Element => {
  const { page } = useSitecore();
  const { route, context } = page.layout.sitecore;
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' ||
      !page.mode.isNormal ||
      !route?.itemId ||
      !config.api.edge.clientContextId
    )
      return;
    const language = route.itemLanguage || config.defaultLanguage;
    pageView({
      channel: 'WEB',
      currency: 'USD',
      page: route.name,
      pageVariantId: CdpHelper.getPageVariantId(
        route.itemId,
        language,
        context.variantId as string,
        config.personalize.scope
      ),
      language,
    }).catch(() => console.debug('Native page view unavailable.'));
  }, [page.mode.isNormal, page.siteName, route, context.variantId]);
  return <></>;
};
export default CdpPageView;
