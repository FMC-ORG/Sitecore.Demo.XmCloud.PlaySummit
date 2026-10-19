import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import components from '.sitecore/component-map';
import client from 'lib/sitecore-client';
import Layout from 'src/Layout';
import NotFound from 'src/NotFound';
import Providers from 'src/Providers';

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): React.JSX.Element => {
  useEffect(() => {
    handleEditorFastRefresh();
  }, []);
  if (notFound || !page) return <NotFound />;
  return (
    <Providers page={page} componentProps={componentProps}>
      <Layout page={page} />
    </Providers>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export const getStaticProps: GetStaticProps = async (context) => {
  const page =
    context.preview && isDesignLibraryPreviewData(context.previewData)
      ? await client.getDesignLibraryData(context.previewData)
      : context.preview
        ? await client.getPreview(context.previewData)
        : await client.getPage(extractPath(context), { locale: context.locale });
  const props = page
    ? {
        page,
        dictionary: await client.getDictionary({ site: page.siteName, locale: page.locale }),
        componentProps: await client.getComponentData(page.layout, context, components),
      }
    : {};
  return { props, notFound: !page, revalidate: 5 };
};

export default SitecorePage;
