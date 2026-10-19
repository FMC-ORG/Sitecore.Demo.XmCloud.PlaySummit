import { RichText, useSitecore, RichTextField } from '@sitecore-content-sdk/nextjs';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: React.JSX.Element;
};

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component content ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-content">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: PageContentProps): React.JSX.Element => {
  const { page } = useSitecore();
  const routeContent = page.layout.sitecore.route?.fields?.Content as RichTextField | undefined;
  const id = props.params.RenderingIdentifier;

  if (!(props.fields && props.fields.Content) && !routeContent) {
    return (
      <div className={`component content ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Content]</div>
        </div>
      </div>
    );
  }

  const field = (
    props.fields && props.fields.Content ? props.fields.Content : routeContent
  ) as RichTextField;

  return (
    <ComponentContent styles={props.params.styles} id={id}>
      <RichText field={field} />
    </ComponentContent>
  );
};
