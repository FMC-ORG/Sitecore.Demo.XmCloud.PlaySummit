import { ComponentParams, ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';
import { PropsWithChildren } from 'react';

/** Shared rendering props supplied by the Content SDK placeholder. */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams;
};

/** Components can receive a Page explicitly or access it with useSitecore(). */
export type ComponentWithPageProps = ComponentProps & { page: Page };

/** Shared rendering props with React children. */
export type ComponentWithChildrenProps = PropsWithChildren<ComponentProps>;
