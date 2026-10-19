import { HealthcheckMiddleware } from '@sitecore-content-sdk/nextjs/monitoring';

const handler = new HealthcheckMiddleware().getHandler();
export default handler;
