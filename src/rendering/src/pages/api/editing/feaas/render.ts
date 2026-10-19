import { FEAASRenderMiddleware } from '@sitecore-content-sdk/nextjs/editing';

const handler = new FEAASRenderMiddleware().getHandler();
export default handler;
