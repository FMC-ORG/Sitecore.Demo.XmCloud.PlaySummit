import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import InformationPageHero from '../NonSitecore/InformationPageHero';
import Head from 'next/head';

export type VendorInformationPageHeroProps = ComponentProps & {
  fields: {
    Name: Field<string>;
    Logo: ImageField;
    Level: Field<string>;
    FacebookProfileLink?: Field<string>;
    TwitterProfileLink?: Field<string>;
    InstagramProfileLink?: Field<string>;
    LinkedinProfileLink?: Field<string>;
  };
};

const VendorInformationPageHero = (props: VendorInformationPageHeroProps): React.JSX.Element => {
  const { fields = {} as VendorInformationPageHeroProps['fields'], ...propsRest } = props;
  const newFields = {
    Name: fields.Name,
    Image: fields.Logo,
    FacebookProfileLink: fields.FacebookProfileLink,
    TwitterProfileLink: fields.TwitterProfileLink,
    InstagramProfileLink: fields.InstagramProfileLink,
    LinkedinProfileLink: fields.LinkedinProfileLink,
  };
  const qualificative = fields.Level?.value ? fields.Level.value : '';

  return (
    <>
      <Head>
        <meta property="og:title" content={fields.Name?.value} />
        <meta property="og:image" content={fields.Logo?.value?.src} />
        <meta property="og:type" content="vendor" />
      </Head>
      <InformationPageHero
        {...propsRest}
        fields={newFields}
        type="vendor"
        qualificative={qualificative}
      />
    </>
  );
};

export const Default = VendorInformationPageHero;
