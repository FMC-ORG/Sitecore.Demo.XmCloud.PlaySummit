import { EditingRenderMiddleware } from '@sitecore-content-sdk/nextjs/editing';

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' }, responseLimit: false },
};
const handler = new EditingRenderMiddleware().getHandler();
export default handler;
