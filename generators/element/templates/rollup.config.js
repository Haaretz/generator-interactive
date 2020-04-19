import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import postcssLogical from 'postcss-logical';
import autoprefixer from 'autoprefixer';
import precss from 'precss';

import pkg from './package.json';
import createHtml from './scripts/createHtml';


// NOTE: this value must be defined outside of the plugin because it needs
// to persist from build to build (e.g. the module and nomodule builds).
// If, in the future, the build process were to extends beyond just this rollup
// config, then the manifest would have to be initialized from a file, but
// since everything  is currently being built here, it's OK to just initialize
// it as an empty object object when the build starts.
const manifest = {};

/**
 * A Rollup plugin to generate a manifest of chunk names to their filenames
 * (including their content hash). This manifest is then used by the template
 * to point to the currect URL.
 * @return {Object}
 */
function manifestPlugin() {
  return {
    name: 'manifest',
    generateBundle(options, bundle) {
      for (const [name, assetInfo] of Object.entries(bundle)) {
        // The postcss plugin does not assign `assetInfo.name` for some reason
        // so we need to hack around it
        if (!assetInfo.name) {
          // only generate an entry for the actual css file and not the sourcemap
          if (name.endsWith('.css')) manifest.css = name;
        }
        else manifest[assetInfo.name] = name;
      }

      this.emitFile({
        type: 'asset',
        fileName: 'file-manifest.json',
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}
function fillHtmlPlugin() {
  return {
    name: 'fillHtml',
    generateBundle() {
      createHtml(manifest);
    },
  };
}

/**
 * A Rollup plugin to generate a list of import dependencies for each entry
 * point in the module graph. This is then used by the template to generate
 * the necessary `<link rel="modulepreload">` tags.
 * @return {Object}
 */
function modulepreloadPlugin() {
  return {
    // name: 'modulepreload',
    name: 'preload',
    generateBundle(options, bundle) {
      // A mapping of entry chunk names to their full dependency list.
      const modulepreloadMap = {};

      // Loop through all the chunks to detect entries.
      for (const [fileName, chunkInfo] of Object.entries(bundle)) {
        if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
          modulepreloadMap[chunkInfo.name] = [fileName, ...chunkInfo.imports];
        }
      }

      this.emitFile({
        type: 'asset',
        // fileName: 'modulepreload.json',
        fileName: 'preload.json',
        source: JSON.stringify(modulepreloadMap, null, 2),
      });
    },
  };
}

function basePlugins({nomodule = false} = {}) {
  const browsers = nomodule ? ['ie 11'] : pkg.browserslist;

  const plugins = [
    nodeResolve(),
    commonjs(),
    postcss({
      plugins: [
        precss({
          // properties: { disable: true, },
          variables: { isDev: !isProd(), },
        }),
        postcssLogical({ dir: 'rtl', }),
        autoprefixer,
      ],
      extract: !nomodule,
      // extract: 'public/styles.[hash].css',
      minimize: true,
      sourceMap: true,
    }),
    babel({
      exclude: [ 'node_modules/**', '!node_modules/ramda/es' ],
      presets: [['@babel/preset-env', {
        targets: { browsers, },
        // useBuiltIns: 'usage',
        // corejs: 3,
      }]],
      // plugins: [['@babel/plugin-transform-react-jsx']],
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production'), }),
    manifestPlugin(),
  ];
  // Only add minification in production and when not running on Glitch.
  if (isProd()) {
    plugins.push(terser({module: !nomodule}));
  }
  if (nomodule) {
    plugins.push(fillHtmlPlugin());
  }
  else {
    plugins.unshift(del({
      targets: 'public/*.{css,html,js,json,map}',
    }));
  }
  return plugins;
}

// Module config for <script type="module">
const moduleConfig = {
  input: {
    'module': 'src/module.js',
  },
  output: {
    dir: pkg.config.publicDir,
    format: 'esm',
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: '[name]-[hash].js',
    dynamicImportFunction: '__import__',
    sourcemap: true,
  },
  plugins: [
    ...basePlugins(),
    modulepreloadPlugin(),
  ],
  // manualChunks(id) {
  //   if (id.includes('node_modules')) {
  //     // The directory name following the last `node_modules`.
  //     // Usually this is the package, but it could also be the scope.
  //     const directories = id.split(path.sep);
  //     const name = directories[directories.lastIndexOf('node_modules') + 1];
  //
  //     // Group `tslib` and `dynamic-import-polyfill` into the default bundle.
  //     // NOTE: This isn't strictly necessary for this app, but it's included
  //     // to show how to manually keep deps in the default chunk.
  //     if (name === 'dynamic-import-polyfill') {
  //       return;
  //     }
  //
  //     // Otherwise just return the name.
  //     return name;
  //   }
  // },
  watch: {
    clearScreen: false,
  },
};

// Legacy config for <script nomodule>
const nomoduleConfig = {
  input: {
    'nomodule': 'src/nomodule.js',
  },
  output: {
    dir: pkg.config.publicDir,
    format: 'iife',
    entryFileNames: '[name]-[hash].js',
  },
  plugins: basePlugins({nomodule: true}),
  inlineDynamicImports: true,
  watch: {
    clearScreen: false,
  },
};

const configs = [ moduleConfig, nomoduleConfig, ];
// if (isProd()) {
//   configs.push(nomoduleConfig);
// }

function isProd() {
  return process.env.NODE_ENV === 'production';
}

export default configs;
