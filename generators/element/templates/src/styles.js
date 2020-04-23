////////////////////////////////////////////////////////////////////////
//       This is a CSS-only entrypoint to improve cache busting       //
//          of the CSS bundle, independent of the js bundle           //
////////////////////////////////////////////////////////////////////////

// Dev only styles. Will not generate anything for production builds
import './style/base/reset.css';

// Main Stylesheet
import './style/styles.scss';

export default function styles() {
  console.log('styles');
}
