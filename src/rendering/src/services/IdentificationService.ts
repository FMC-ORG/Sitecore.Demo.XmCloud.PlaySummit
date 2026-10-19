import { identifyVisitor as identifyVisitorInXmc } from './CloudSDKService';

/** Native telemetry is optional for the CMS demo form; no legacy guest profile is accessed. */
export async function identifyVisitor(
  email: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
): Promise<unknown> {
  try {
    return await identifyVisitorInXmc(email, firstName, lastName, phoneNumber);
  } catch {
    console.debug('Native visitor identification is unavailable; continuing the CMS demo form.');
    return undefined;
  }
}
