import {
  Field,
  ImageField,
  NextImage,
  Link,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { CSSProperties } from 'react';

interface Fields {
  Image: ImageField;
  ImageCaption?: Field<string>;
  TargetUrl?: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields?: Fields;
};

const ImageDefault = (props: ImageProps): React.JSX.Element => (
  <div className={`component image ${props.params.styles ?? ''}`.trimEnd()}>
    <div className="component-content">
      <span className="is-empty-hint">Image</span>
    </div>
  </div>
);

export const Banner = (props: ImageProps): React.JSX.Element => {
  const { page } = useSitecore();
  if (!props.fields?.Image) return <ImageDefault {...props} />;

  const id = props.params.RenderingIdentifier;
  const classHeroBannerEmpty =
    page.mode.isEditing && props.fields.Image.value?.class === 'scEmptyImage'
      ? 'hero-banner-empty'
      : '';
  const backgroundStyle: CSSProperties | undefined = props.fields.Image.value?.src
    ? { backgroundImage: `url('${props.fields.Image.value.src}')` }
    : undefined;

  return (
    <div
      className={`component hero-banner ${props.params.styles ?? ''} ${classHeroBannerEmpty}`}
      id={id ? id : undefined}
    >
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle}>
        {page.mode.isEditing && (
          <NextImage field={props.fields.Image} style={{ width: '100%', height: '100%' }} />
        )}
      </div>
    </div>
  );
};

export const Default = (props: ImageProps): React.JSX.Element => {
  const { page } = useSitecore();
  if (!props.fields?.Image) return <ImageDefault {...props} />;

  const image = <NextImage field={props.fields.Image} />;
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component image ${props.params.styles ?? ''}`} id={id ? id : undefined}>
      <div className="component-content">
        {page.mode.isEditing || !props.fields.TargetUrl?.value?.href ? (
          image
        ) : (
          <Link field={props.fields.TargetUrl}>{image}</Link>
        )}
        <Text
          tag="span"
          className="image-caption field-imagecaption"
          field={props.fields.ImageCaption}
        />
      </div>
    </div>
  );
};
