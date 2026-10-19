import React from 'react';
import { SitecoreProvider, LayoutServicePageState } from '@sitecore-content-sdk/nextjs';
import components from '../.sitecore/component-map';
import scConfig from '../sitecore.config';
import '../src/assets/css/abstracts/mixins.css';
import '../src/assets/css/main.css';
import { I18nProvider } from 'next-localization';

export const parameters = { layout: 'fullscreen' };
export const mockLayoutData = {
  sitecore: {
    context: {
      pageEditing: false,
      pageState: LayoutServicePageState.Normal,
      EventInfo: { titlePrefix: 'PLAY! Summit' },
      Languages: [{ Name: 'en' }, { Name: 'fr-CA' }, { Name: 'ja-JP' }],
    },
    route: { name: 'story', itemId: null, fields: {}, placeholders: {} },
  },
};
const page = {
  layout: mockLayoutData,
  siteName: 'playwebsite',
  locale: 'en',
  mode: {
    name: LayoutServicePageState.Normal,
    designLibrary: { isVariantGeneration: false },
    isNormal: true,
    isEditing: false,
    isPreview: false,
    isDesignLibrary: false,
  },
};
export const decorators = [
  (Story) => (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('../.sitecore/import-map')}
    >
      <I18nProvider>
        <Story />
      </I18nProvider>
    </SitecoreProvider>
  ),
];
