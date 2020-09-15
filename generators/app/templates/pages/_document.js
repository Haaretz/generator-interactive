import { renderToNodeList, } from 'react-fela';
import Document, { Html, Head, Main, NextScript, } from 'next/document';
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

    // Add css reset to styleRenderer
    styleRenderer.renderStatic(cssReset);

    // Render typographic custom props
    styleRenderer.renderStatic(generateTypographicCustomProps());
    styleRenderer.renderStatic(generateColorCustomProps());

    const styles = renderToNodeList(styleRenderer);

    return {
      ...initialProps,
      styles: [ ...initialProps.styles, ...styles, ],
    };
  }

  render() {
    return (
      <Html
        lang={LANG}
        dir={LANG === 'he' ? 'rtl' : 'lrt'}
        {...generateDataAttributes()}
      >
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://img.haarets.co.il/" />
          <link rel=" dns-prefetch" href="https://img.haarets.co.il/" />
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
      </Html>
    );
  }
}
