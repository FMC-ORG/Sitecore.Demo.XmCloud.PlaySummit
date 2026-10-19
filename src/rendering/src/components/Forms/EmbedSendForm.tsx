import { ComponentProps } from 'lib/component-props';
import IntegrationUnavailable from 'src/helpers/IntegrationUnavailable';

// Preserve the CMS rendering name; the separately configured Send form is archived.
const EmbedSendForm = (props: ComponentProps): React.JSX.Element => (
  <IntegrationUnavailable name="Sitecore Send" styles={props.params?.styles} />
);

export default EmbedSendForm;
