import { EditingConfigMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import components from '.sitecore/component-map';
import metadata from '.sitecore/metadata.json';

const handler = new EditingConfigMiddleware({ components, metadata }).getHandler();
export default handler;
