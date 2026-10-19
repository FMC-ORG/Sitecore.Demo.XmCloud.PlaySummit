import {
  Image,
  ImageField,
  FieldMetadata,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type HeroImageProps = ComponentProps & {
  fields: {
    hero: ImageField & FieldMetadata;
  };
};

const HeroImage = (props: HeroImageProps): React.JSX.Element => {
  const { page } = useSitecore();
  const sxaStyles = `${props.params?.styles || ''}`;

  if (props.fields?.hero?.value?.src || (page.mode.isEditing && props.fields?.hero?.metadata)) {
    return (
      <section className={`hero-image ${sxaStyles}`}>
        <Image field={props.fields?.hero} alt="" loading="lazy" />
      </section>
    );
  }

  return <div>Hero image is missing from the datasource</div>;
};

export const Default = withDatasourceCheck()<HeroImageProps>(HeroImage);
