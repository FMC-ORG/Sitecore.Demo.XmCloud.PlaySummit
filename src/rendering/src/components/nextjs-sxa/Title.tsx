import { Link, LinkField, Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';

type TitleItem = {
  url?: { path: string; siteName: string };
  field?: { jsonValue: TextField };
};

type TitleProps = {
  params: { [key: string]: string };
  fields?: { data?: { datasource?: TitleItem; contextItem?: TitleItem } };
};

export const Default = (props: TitleProps): React.JSX.Element => {
  const { page } = useSitecore();
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const sourceText = datasource?.field?.jsonValue;
  const isAuthorMode = page.mode.isEditing || page.mode.isPreview;
  // Preserve editor diagnostics without mutating CMS field data held by the Page.
  const text: TextField =
    isAuthorMode && !sourceText?.value ? { ...sourceText, value: 'Title field' } : sourceText || {};
  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title: sourceText?.value?.toString(),
      ...(isAuthorMode && datasource?.url?.siteName
        ? { querystring: `sc_site=${datasource.url.siteName}` }
        : {}),
    },
  };
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component title ${props.params.styles ?? ''}`} id={id || undefined}>
      <div className="component-content">
        <div className="field-title">
          {page.mode.isEditing || !link.value.href ? (
            <Text field={text} />
          ) : (
            <Link field={link}>
              <Text field={text} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
