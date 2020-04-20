import dynamicImportPolyfill from 'dynamic-import-polyfill';
import { init, } from './index.js';

// This needs to be done before any dynamic imports are used.
// If your modules are hosted in a sub-directory, it must be specified here.
dynamicImportPolyfill.initialize({modulePath: './'});

// Start the app.
init();
