import { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export type ProductCategory = {
  fields: {
    Title: Field<string>;
    Picture: ImageField;
  };
};
