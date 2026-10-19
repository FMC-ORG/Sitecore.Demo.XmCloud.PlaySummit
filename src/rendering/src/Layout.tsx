import Head from 'next/head';
import {
  Placeholder,
  DesignLibrary,
  Page,
  Field,
  PageMetaTags,
} from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';

type RouteFields = { Title?: Field; pageTitle?: Field };

const Layout = ({ page }: { page: Page }): React.JSX.Element => {
  const { route, context } = page.layout.sitecore;
  const fields = route?.fields as RouteFields;
  const eventInfo = context.EventInfo as { titlePrefix?: string } | undefined;
  const title = fields?.pageTitle?.value || fields?.Title?.value;
  const pageTitle = `${eventInfo?.titlePrefix || 'PLAY! Summit'}${title ? ` - ${title}` : ''}`;
  const editorClass = page.mode.isEditing || page.mode.isPreview ? 'experience-editor-active' : '';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={page.layout} />
      <PageMetaTags route={route} />
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      <div className={page.mode.isEditing ? 'editing-mode' : 'prod-mode'}>
        {page.mode.isDesignLibrary ? (
          <DesignLibrary />
        ) : (
          <>
            <header className={editorClass}>
              {route && <Placeholder name="headless-header" rendering={route} />}
            </header>
            <main className={editorClass}>
              {route && <Placeholder name="headless-main" rendering={route} />}
            </main>
            <footer>{route && <Placeholder name="headless-footer" rendering={route} />}</footer>
          </>
        )}
      </div>
    </>
  );
};
export default Layout;
