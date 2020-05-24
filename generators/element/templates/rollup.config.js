import path from 'path';
import { terser, } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import del from 'rollup-plugin-delete';
<% if (!inApp) { %>
import postcss from 'rollup-plugin-postcss';
import postcssLogical from 'postcss-logical';
import autoprefixer from 'autoprefixer';
import jsToSass from 'json-sass/lib/jsToSassString';
import createHtml from './scripts/createHtml';
<% } %>
import pkg from './package.json';


// NOTE: this value must be defined outside of the plugin because it needs
// to persist from build to build (e.g. the module and nomodule builds).
// If, in the future, the build process were to extends beyond just this rollup
// config, then the manifest would have to be initialized from a file, but
// since everything  is currently being built here, it's OK to just initialize
// it as an empty object object when the build starts.
const manifest = {};

// NOTE: this value must be defined outside of the plugin because it needs
// A mapping of entry chunk names to their full dependency list.
const modulepreloadMap = {};

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
      for (const [ name, assetInfo, ] of Object.entries(bundle)) {
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
<% if(!inApp) { %>
function fillHtmlPlugin() {
  return {
    name: 'fillHtml',
    generateBundle() {
      createHtml(manifest);
    },
  };
}
<% } %>
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
      // Loop through all the chunks to detect entries.
      for (const [ fileName, chunkInfo, ] of Object.entries(bundle)) {
        if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
          modulepreloadMap[chunkInfo.name] = [ fileName, ...chunkInfo.imports, ];
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

function plugins({ type, } = {}) {
  const browsers = type === 'nomodule' ? [ 'ie 11', ] : pkg.browserslist;

  const pluginList = [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: [ 'node_modules/**', '!node_modules/ramda/es', ],
      presets: [ [ '@babel/preset-env', {
        targets: { browsers, },
        // useBuiltIns: 'usage',
        // corejs: 3,
      }, ], ],
      // plugins: [['@babel/plugin-transform-react-jsx']],
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production'), }),
    manifestPlugin(),
  ];
  // Only add minification in production and when not running on Glitch.
  if (isProd()) {
    pluginList.push(terser({ module: type !== 'nomodule', }));
  }
  <% if (!inApp) { %>
  if (type === 'style') {
    const sassData = Object.entries({
      isDev: !isProd(),
      isApp: <%= inApp %>,
      ...(<%= theme %>),
    }).reduce((vars, entry) => `${vars}$${entry[0]}:${jsToSass(entry[1])};`, '');

    const postcssConfig = {
      plugins: [
        postcssLogical({ dir: <%= lang.toLowerCase() === 'english' ? 'ltr' : 'rtl' %>, }),
        autoprefixer,
      ],
      extract: true,
      // extract: 'public/styles.[hash].css',
      minimize: true,
      sourceMap: true,
      use: { sass: {
        // Share variables between Sass and js
        data: sassData,
        // Enable sourcemaps deep-linked to the original sass partials
        // instead of just the main input file
        sourceMap: true,
        outFile: 'styles.css',
      }, },
    };

    pluginList.splice(2, 0, postcss(postcssConfig));
    pluginList.push(fillHtmlPlugin());
  }
  <% } %>
  // module build
  if (type === 'module') {
    pluginList.unshift(del({
      cwd: pkg.publicDir,
      targets: '!static',
    }));
  }
  if (type !== 'nomodule') pluginList.push(modulepreloadPlugin());

  return pluginList;
}

// Module config for <script type="module">
const moduleConfig = {
  input: { module: 'src/module.js', },
  output: {
    dir: pkg.config.publicDir,
    format: 'esm',
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: '[name]-[hash].js',
    dynamicImportFunction: '__import__',
    sourcemap: true,
  },
  plugins: plugins({ type: 'module', }),

  manualChunks(id) {
    if (id.includes('node_modules')) {
      // The directory name following the last `node_modules`.
      // Usually this is the package, but it could also be the scope.
      const directories = id.split(path.sep);
      const nameOrScopeIndex = directories.lastIndexOf('node_modules') + 1;
      const nameOrScope = directories[nameOrScopeIndex];
      const name = (nameOrScope && nameOrScope.startsWith('@'))
        ? directories[nameOrScopeIndex + 1]
        : nameOrScope;

      // Group `dynamic-import-polyfill` into the default bundle.
      if (name === 'dynamic-import-polyfill') {
        return undefined;
      }

      // Otherwise just return the name.
      return name;
    }

    return undefined;
  },
  watch: {
    clearScreen: false,
  },
};

// Legacy config for <script nomodule>
const nomoduleConfig = {
  input: {
    nomodule: 'src/nomodule.js',
  },
  output: {
    dir: pkg.config.publicDir,
    format: 'iife',
    entryFileNames: '[name]-[hash].js',
  },
  plugins: plugins({ type: 'nomodule', }),
  inlineDynamicImports: true,
  watch: {
    clearScreen: false,
  },
};

<% if (inApp) { %>
const configs = [ moduleConfig, nomoduleConfig, ];
<% } else { %>
const stylesConfig = {
  input: { styles: 'src/styles.js', },
  output: {
    dir: pkg.config.publicDir,
    format: 'esm',
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: '[name]-[hash].js',
    dynamicImportFunction: '__import__',
    sourcemap: true,
  },
  plugins: plugins({ type: 'style', }),
};
const configs = [ moduleConfig, nomoduleConfig, stylesConfig, ];
<% } %>


function isProd() {
  return process.env.NODE_ENV === 'production';
}

export default configs;
