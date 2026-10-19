import { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export type Vendor = {
  fields: {
    Name: Field<string>;
    Level: Field<string>;
    Logo: ImageField;
  };
  url: string;
};
