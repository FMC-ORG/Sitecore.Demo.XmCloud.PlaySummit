import { Field } from '@sitecore-content-sdk/nextjs';

export type Day = {
  fields: {
    Name: Field<string>;
  };
};

export type GraphQLDay = {
  name: Field<string>;
};
