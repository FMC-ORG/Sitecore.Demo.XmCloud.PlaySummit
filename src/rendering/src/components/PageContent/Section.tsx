import {
  RichText,
  Text,
  Field,
  Link,
  Placeholder,
  LinkField,
  FieldMetadata,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentWithChildrenProps } from 'lib/component-props';

type SectionProps = ComponentWithChildrenProps & {
  fields: {
    title: Field<string>;
    content: Field<string>;
    callToActionLink: LinkField & FieldMetadata;
  };
};

const Section = (props: SectionProps): React.JSX.Element => {
  const { page } = useSitecore();
  const sxaStyles = `${props.params?.styles || ''}`;

  const titleAndContent = props.fields && (
    <>
      <Text tag="h2" field={props.fields.title} className="section-content-title" />
      {props.fields.content && (
        <RichText tag="div" field={props.fields.content} className="section-content-p" />
      )}
    </>
  );

  const placeholder = !!props.rendering && (
    <Placeholder name="jss-section-content" rendering={props.rendering} />
  );

  const callToAction = (props.fields?.callToActionLink?.value?.href ||
    (page.mode.isEditing && props.fields?.callToActionLink?.metadata)) && (
    <Link field={props.fields.callToActionLink} className="btn-main" />
  );

  return (
    <section className={`section ${sxaStyles}`}>
      <div className="section-content container">
        {titleAndContent}
        {placeholder}
        {props.children}
        {callToAction}
      </div>
    </section>
  );
};

export const Default = Section;
