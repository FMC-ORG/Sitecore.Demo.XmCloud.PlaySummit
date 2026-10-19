import { EditingScripts } from '@sitecore-content-sdk/nextjs';
import BYOC from 'src/byoc';
import CdpPageView from 'components/nextjs-sxa/CdpPageView';
import FEAASScripts from 'components/nextjs-sxa/FEAASScripts';

const Scripts = (): React.JSX.Element => (
  <>
    <BYOC />
    <CdpPageView />
    <FEAASScripts />
    <EditingScripts />
  </>
);
export default Scripts;
