import { Field, ImageField, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import InformationPageHero from '../NonSitecore/InformationPageHero';
import { useI18n } from 'next-localization';
import Head from 'next/head';

export type SpeakerInformationPageHeroProps = ComponentProps & {
  fields: {
    Name: Field<string>;
    Featured: Field<boolean>;
    Picture: ImageField;
    JobTitle: Field<string>;
    Company: Field<string>;
    Location: Field<string>;
    FacebookProfileLink?: Field<string>;
    TwitterProfileLink?: Field<string>;
    InstagramProfileLink?: Field<string>;
    LinkedinProfileLink?: Field<string>;
  };
};

const SpeakerInformationPageHero = (props: SpeakerInformationPageHeroProps): React.JSX.Element => {
  const { page } = useSitecore();
  const { t } = useI18n();

  const isPageEditing = page.mode.isEditing;

  const { fields = {} as SpeakerInformationPageHeroProps['fields'], ...propsRest } = props;
  const newFields = {
    Name: fields.Name,
    Image: fields.Picture,
    FacebookProfileLink: fields.FacebookProfileLink,
    TwitterProfileLink: fields.TwitterProfileLink,
    InstagramProfileLink: fields.InstagramProfileLink,
    LinkedinProfileLink: fields.LinkedinProfileLink,
  };

  const qualificative = fields.Featured?.value ? t('featured') || 'featured' : '';

  const informations =
    fields.JobTitle?.value || fields.Company?.value || fields.Location?.value || isPageEditing ? (
      <>
        {fields.JobTitle?.value || isPageEditing ? (
          <div>
            <span className="label">{t('Job Title') || 'Job Title'}:</span>{' '}
            <Text field={fields.JobTitle} tag="span" />
          </div>
        ) : undefined}
        {fields.Company?.value || isPageEditing ? (
          <div>
            <span className="label">{t('Company') || 'Company'}:</span>{' '}
            <Text field={fields.Company} tag="span" />
          </div>
        ) : undefined}
        {fields.Location?.value || isPageEditing ? (
          <div>
            <span className="label">{t('Location') || 'Location'}:</span>{' '}
            <Text field={fields.Location} tag="span" />
          </div>
        ) : undefined}
      </>
    ) : undefined;

  return (
    <>
      <Head>
        <meta property="og:title" content={fields.Name?.value} />
        <meta property="og:image" content={fields.Picture?.value?.src} />
        <meta property="og:type" content="speaker" />
      </Head>
      <InformationPageHero
        {...propsRest}
        fields={newFields}
        type="speaker"
        qualificative={qualificative}
        informations={informations}
      />
    </>
  );
};

export const Default = SpeakerInformationPageHero;
