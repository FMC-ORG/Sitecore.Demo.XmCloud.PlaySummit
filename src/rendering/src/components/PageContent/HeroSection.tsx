import {
  Text,
  Field,
  RichText,
  Image,
  ImageField,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type HeroProps = ComponentProps & {
  fields: {
    Hero: ImageField;
    Slogan: Field<string>;
    Eyebrow: Field<string>;
    Title: Field<string>;
    Body: Field<string>;
  };
};

const HeroSection = (props: HeroProps): React.JSX.Element => (
  <section
    className={`hero-section hero-section-editable hero_${props.rendering.uid} ${
      props.params?.styles || ''
    }`}
  >
    <div className="hero-background">
      <Image field={props.fields.Hero} />
    </div>
    <div className="hero-container">
      <div className="container-content">
        <div className="content-text">
          <Text field={props.fields.Slogan} tag="p" className="slogan" />
          <Text field={props.fields.Eyebrow} tag="h1" className="expo" />
          <Text field={props.fields.Title} tag="h3" className="title" />
          <RichText field={props.fields.Body} tag="div" className="subtitle" />
        </div>
        <Placeholder name="jss-hero-section-content" rendering={props.rendering} />
      </div>
    </div>
  </section>
);

export const Default = withDatasourceCheck()<HeroProps>(HeroSection);
