import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement } from 'react';
import Head from 'next/head';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import Bootstrap from 'src/Bootstrap';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'assets/css/main.css';

config.autoAddCss = false;

type NextPageWithLayout = NextPage<SitecorePageProps> & {
  getLayout?: (page: ReactElement) => ReactElement;
};
type AppPropsWithLayout = AppProps<SitecorePageProps> & { Component: NextPageWithLayout };

function App({ Component, pageProps }: AppPropsWithLayout): React.JSX.Element {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="PLAY! Summit" />
      </Head>
      <Bootstrap {...pageProps} />
      <I18nProvider
        lngDict={pageProps.dictionary}
        locale={pageProps.page?.locale || scConfig.defaultLanguage}
      >
        {getLayout(<Component {...pageProps} />)}
      </I18nProvider>
    </>
  );
}
export default App;
