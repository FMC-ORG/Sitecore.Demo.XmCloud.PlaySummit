import IntegrationUnavailable from 'src/helpers/IntegrationUnavailable';

// Keep the presentation/story component resolvable without a legacy DOM personalization target.
const HeaderCdpMessageBar = (): React.JSX.Element => <IntegrationUnavailable name="Legacy CDP" />;

export default HeaderCdpMessageBar;
