import { LayoutServicePageState } from '@sitecore-content-sdk/nextjs';

export const isEditingOrPreviewingPage = (pageState: LayoutServicePageState): boolean =>
  pageState === LayoutServicePageState.Edit || pageState === LayoutServicePageState.Preview;
