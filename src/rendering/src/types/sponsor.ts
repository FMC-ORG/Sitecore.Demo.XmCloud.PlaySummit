import { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export type Sponsor = {
  fields: {
    Name: Field<string>;
    Logo: ImageField;
  };
  url: string;
};
