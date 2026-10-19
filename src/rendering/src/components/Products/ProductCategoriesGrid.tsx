import { ComponentProps } from 'lib/component-props';
import IntegrationUnavailable from 'src/helpers/IntegrationUnavailable';

// The saved CMS rendering remains resolvable without a link into the archived shop.
export const Default = (props: ComponentProps): React.JSX.Element => (
  <IntegrationUnavailable name="OrderCloud commerce" styles={props.params?.styles} />
);
