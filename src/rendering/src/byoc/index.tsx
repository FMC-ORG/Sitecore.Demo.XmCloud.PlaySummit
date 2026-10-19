import React from 'react';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import * as Events from '@sitecore-content-sdk/events';
import { SitecoreProviderReactContext, LayoutServicePageState } from '@sitecore-content-sdk/nextjs';
import '@sitecore/components/context';
import dynamic from 'next/dynamic';
import config from 'sitecore.config';
import './index.hybrid';

const ClientBundle = dynamic(() => import('./index.client'), { ssr: false });
FEAAS.enableNextClientsideComponents(dynamic, ClientBundle);

const BYOCInit = (): React.JSX.Element => {
  const { page } = React.useContext(SitecoreProviderReactContext);
  FEAAS.setContextProperties({
    sitecoreEdgeUrl: config.api.edge.edgeUrl,
    sitecoreEdgeContextId: config.api.edge.clientContextId,
    pageState: page.mode.isEditing
      ? LayoutServicePageState.Edit
      : page.mode.isPreview
        ? LayoutServicePageState.Preview
        : LayoutServicePageState.Normal,
    siteName: page.siteName || config.defaultSite,
    eventsSDK: Events,
  });
  return <FEAAS.ExternalComponentBundle />;
};
export default BYOCInit;
