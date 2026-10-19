import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

const BACKGROUND_REG_EXP = new RegExp(
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
);

interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

const DefaultContainer = (props: ComponentProps): React.JSX.Element => {
  const { page } = useSitecore();
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const phKey = `container-${props.params.DynamicPlaceholderId}`;
  const id = props.params.RenderingIdentifier;
  let backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage) {
    const prefix = `${page.mode.isEditing || page.mode.isPreview ? '/sitecore/shell' : ''}/-/media/`;
    backgroundImage = `${backgroundImage?.match(BACKGROUND_REG_EXP)?.pop()?.replace(/-/gi, '')}`;
    backgroundStyle = {
      backgroundImage: `url('${prefix}${backgroundImage}')`,
    };
  }

  return (
    // DEMO TEAM CUSTOMIZATION - Move the style={backgroundStyle} attribute from the component-content div to the outer div.
    // DEMO TEAM CUSTOMIZATION - Add the "container" CSS class to ensure our PLAY! Summit styles apply also to SXA Container components.
    <div
      className={`component container container-default ${styles}`}
      id={id ? id : undefined}
      style={backgroundStyle}
    >
      <div className="component-content">
        {/* END CUSTOMIZATION */}
        <div className="row">
          <Placeholder name={phKey} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};

export const Default = (props: ComponentProps): React.JSX.Element => {
  const splitStyles = props.params?.Styles?.split(' ');

  if (splitStyles && splitStyles.includes('container')) {
    return (
      <div className="container-wrapper">
        <DefaultContainer {...props} />
      </div>
    );
  }

  return <DefaultContainer {...props} />;
};
