import { renderToNodeList, } from 'react-fela';
import Document, { Head, Main, NextScript, } from 'next/document';
import React from 'react';
import config from 'config';

import { POLYFILL_SRC, LANG, } from '../consts/index';
import {
  cssReset,
  fontStacks,
  generateColorCustomProps,
  generateTypographicCustomProps,
} from '../theme/index';
import PreloadJS from '../components/PreloadJs';
import fileManifest from '../public/file-manifest.json';
import getFelaRenderer from '../utils/getFelaRenderer';
import { generateDataAttributes, } from '../utils/setDataAttributes';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const styleRenderer = getFelaRenderer();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: App => props => (
        <App {...props} renderer={styleRenderer} />
      ),
    });

    const initialProps = await Document.getInitialProps(ctx);

    // Add webfonts to styleRenderer
    fontStacks.webfonts.forEach(fontFamilyRule => styleRenderer.renderFont(...fontFamilyRule));

    // Render typographic custom props
    styleRenderer.renderStatic(generateTypographicCustomProps());
    styleRenderer.renderStatic(generateColorCustomProps());

    // Add css reset to styleRenderer
    styleRenderer.renderStatic(cssReset);

    const styles = renderToNodeList(styleRenderer);

    return {
      ...initialProps,
      styles: [ ...initialProps.styles, ...styles, ],
    };
  }

  render() {
    return (
      <html
        lang={LANG}
        dir={LANG === 'he' ? 'rtl' : 'lrt'}
        {...generateDataAttributes()}
      >
        <Head>
          <link rel="preconnect" href="https://images.haarets.co.il/" />
          <link rel=" dns-prefetch" href="https://images.haarets.co.il/" />
          <link rel="preconnect" href="https://google-analytics.com" />
          <link rel=" dns-prefetch" href="https://google-analytics.com" />
          <link rel="preconnect" href="https://s3.amazonaws.com" />
          <link rel=" dns-prefetch" href="https://s3.amazonaws.com" />
          <PreloadJS />
        </Head>
        <body>
          <Main />

          <script crossOrigin="anonymous" src={POLYFILL_SRC} />
          <script
            type="module"
            src={`${config.get('pathPrefix')}${fileManifest.module}`}
          />
          <script
            noModule
            src={`${config.get('pathPrefix')}${fileManifest.nomodule}`}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
