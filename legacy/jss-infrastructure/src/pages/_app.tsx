import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement } from 'react';
import Head from 'next/head';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';
import Bootstrap from 'src/Bootstrap';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'assets/css/main.css';

config.autoAddCss = false;

type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps<SitecorePageProps> & {
  Component: NextPageWithLayout<SitecorePageProps>;
};

function App({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
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
      <I18nProvider lngDict={pageProps.dictionary} locale={pageProps.locale}>
        {getLayout(<Component {...pageProps} />)}
      </I18nProvider>
    </>
  );
}

export default App;
