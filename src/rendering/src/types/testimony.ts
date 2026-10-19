import { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export type Testimony = {
  fields: {
    Provider: Field<string>;
    Testimony: Field<string>;
    Logo: ImageField;
  };
};
