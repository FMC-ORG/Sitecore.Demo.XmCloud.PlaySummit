import Head from 'next/head';
import { LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';

const SitecoreStyles = ({
  layoutData,
}: {
  layoutData: LayoutServiceData;
}): React.JSX.Element | null => {
  const links = client.getHeadLinks(layoutData, { enableStyles: false, enableThemes: true });
  if (!links.length) return null;
  return (
    <Head>
      {links.map(({ rel, href }) => (
        <link key={href} rel={rel} href={href} />
      ))}
    </Head>
  );
};
export default SitecoreStyles;
