import { Field } from '@sitecore-content-sdk/nextjs';

export type Room = {
  fields: {
    Name: Field<string>;
  };
};

export type GraphQLRoom = {
  name: Field<string>;
};
