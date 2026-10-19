import { EPResponse } from '@sitecore-cloudsdk/core/internal';
import { IdentityData, event, identity } from '@sitecore-cloudsdk/events/browser';

import { CDP_CUSTOM_EVENTS } from 'src/constants/cdp-custom-events';
import { TICKETS } from 'src/models/mock-tickets';
import config from 'temp/config';

const channel = 'WEB';
const currency = 'USD';
const language = (
  typeof window !== 'undefined' ? window?.navigator?.language : config.defaultLanguage
)?.slice(0, 2);

export const identifyVisitor = async (
  email: string,
  firstName = '',
  lastName = '',
  phone = ''
): Promise<EPResponse> => {
  const eventData: IdentityData = {
    email,
    channel,
    currency,
    language,
    firstName,
    lastName,
    phone,
    page: window?.location?.pathname + window?.location?.search,
    identifiers: [
      {
        id: email,
        provider: 'email',
      },
    ],
  };

  return identity(eventData);
};

export const logAudiencePreferenceEvent = async (audience: string): Promise<EPResponse> => {
  return event({
    type: CDP_CUSTOM_EVENTS.audiencePreference.type,
    extensionData: {
      channel,
      currency,
      audience,
    },
  });
};

export const logTicketPurchase = async (ticketId: number): Promise<EPResponse> => {
  const purchasedTicketItem = TICKETS[ticketId];

  // Log PAYMENT_FORM_COMPLETED custom event
  await event({
    type: CDP_CUSTOM_EVENTS.paymentFormCompleted.type,
    extensionData: {
      channel,
      currency,
    },
  });

  // Log PAYMENT_SUCCESSFUL custom event
  await event({
    type: CDP_CUSTOM_EVENTS.paymentSuccessful.type,
    extensionData: {
      channel,
      currency,
    },
  });

  // Log TICKET_PURCHASED custom event
  return event({
    type: CDP_CUSTOM_EVENTS.ticketPurchased.type,
    extensionData: {
      channel,
      currency,
      ticketId,
      ticketName: purchasedTicketItem.name,
      pricePaid: purchasedTicketItem.price,
    },
  });
};

export const logAttendeeFormCompleted = async (): Promise<EPResponse> => {
  return event({
    type: CDP_CUSTOM_EVENTS.attendeeFormCompleted.type,
    extensionData: {
      channel,
      currency,
    },
  });
};

export const logTicketSelected = async (): Promise<EPResponse> => {
  return event({
    type: CDP_CUSTOM_EVENTS.ticketSelected.type,
    extensionData: {
      channel,
      currency,
    },
  });
};
