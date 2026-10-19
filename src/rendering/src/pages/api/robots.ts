import { RobotsMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import client from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

const handler = new RobotsMiddleware(client, sites).getHandler();
export default handler;
