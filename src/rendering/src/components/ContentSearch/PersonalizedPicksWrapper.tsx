import { ComponentProps } from 'lib/component-props';
import IntegrationUnavailable from 'src/helpers/IntegrationUnavailable';

export type PersonalizedPicksWrapperProps = ComponentProps & {
  params: {
    Items: number;
    styles: string;
  };
};

// Preserve the CMS rendering name without loading the separately configured Search SDK.
const PersonalizedPicksWrapper = (props: PersonalizedPicksWrapperProps): React.JSX.Element => (
  <IntegrationUnavailable name="Sitecore Search" styles={props.params?.styles} />
);

export default PersonalizedPicksWrapper;
