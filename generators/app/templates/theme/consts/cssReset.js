/* eslint-disable prefer-template */
import {
  htmlFontSizesAsString,
  bodyTypographyRulesAsString,
} from './typographicBaseline';
import fontStacks from './fontStacks';
import getColor from '../methods/color';

/**
 * Universal
 * 1. Repeating backgrounds should not be the default.
 * 2. Add box sizing should be inherited from parent (and set to `border-box`
 *    on the `html` element).
 */
const styles
  = '*,::before,::after{'
  + 'background-repeat:no-repeat;' // 1
  + 'box-sizing:inherit;' // 2
  + '}'
  // + ':root{'
  // + `--textColor: ${getColor('neutral', '+1')};`
  // + `--bgColor: ${getColor('bg')};`
  // + '--colorChangeDuration: 0;'
  // + '--headlineMargin: 126px;'
  // + '--highlightScale: 8;'
  // + '--dotTextOpacity: 1;'
  // + `--shareBarBgc: ${getColor('neutral', '-6')};`
  // + '}'
  /**
   * 1. Make text-decoration inherited
   * 2. Make vertical-align inherited
   */
  + '::before,'
  + '::after{'
  + 'text-decoration:inherit;' // 1
  + 'vertical-align:inherit;' // 2
  + '}'
  /**
   * HTML Element
   * 1. Makes `border-box` the default `box-sizing` model.
   * 2. Set the default color to that of body text elmenets.
   * 3. Add the default cursor in all browsers.
   * 4. Ensure the page fills at least the full height of the viewport.
   * 5. Set the base font stack, so that it can be enhanced performantly with FOFT.
   * 6. Reduce content jumping when elements (such as ads) are loading outside
   *    the viewport.
   * 7. Prevent the page from exhibiting horizontal scroll-bars when an included
   *    element exceeds the screen width.
   * 8. Prevent font size adjustments after orientation changes in IE and iOS.
   */
  + 'html{'
  + 'box-sizing:border-box;' // 1
  + 'background-color:var(--bgColor);'
  // + `background-color:${getColor('white')};`
  + `color:${getColor('bodyText')};` // 2
  + 'cursor:default;' // 3
  + `font-family:${fontStacks.base};` // 5
  + 'min-height:100%;' // 5
  + 'overflow-anchor:auto;' // 6
  + 'overflow-x:hidden;' // 7
  + '-ms-text-size-adjust:100%;' // 8
  + '-webkit-text-size-adjust:100%;' // 8
  + '}'
  /*
   * Establish a vertical rhythm by setting the 'font-size' of the `html` element,
   * and thus `rem` to the basic rhythm unit.
   */
  + `${htmlFontSizesAsString}`
  /**
   * body element
   * Typographic styles for `body` element based on the pre-defined typographic scale.
   */
  + `${bodyTypographyRulesAsString}`
  /**
   * Block elements
   * Set the correct display in Edge, IE, and Firefox.
   */
  + 'article,'
  + 'aside,'
  + 'details,'
  + 'figcaption,'
  + 'figure,'
  + 'footer,'
  + 'header,'
  + 'menu,'
  + 'nav,'
  + 'main,'
  + 'section{'
  + 'display:block;'
  + '}'
  /** ******************************************************** *
   *                                                           *
   * Remove default styling from semantic elements.            *
   * Form should not be an inherited byproduct of semantics.   *
   *                                                           *
   * ********************************************************* */

  /**
   * Remove default margin and padding set by default user-agent styles.
   */
  + 'blockquote,'
  + 'body,'
  + 'button,'
  + 'caption,'
  + 'dd,'
  + 'dl,'
  + 'fieldset,'
  + 'figure,'
  + 'form,'
  + 'iframe,'
  + 'input,'
  + 'h1,'
  + 'h2,'
  + 'h3,'
  + 'h4,'
  + 'h5,'
  + 'h6,'
  + 'hr,'
  + 'label,'
  + 'legend,'
  + 'ol,'
  + 'optgroup,'
  + 'p,'
  + 'pre,'
  + 'table,'
  + 'td,'
  + 'textarea,'
  + 'th,'
  + 'ul{'
  + 'margin:0;'
  + 'padding:0;'
  + '}'
  /**
   * Headings
   * Elements are for semantics, and should not set font-size
   */
  + 'h1,'
  + 'h2,'
  + 'h3,'
  + 'h4,'
  + 'h5,'
  + 'h6{'
  + 'font-size:1em;'
  + '}'
  /**
   * Lists
   * list-style should be opt-in
   */
  + 'ol,'
  + 'ul{'
  + 'list-style:none;'
  + '}'
  /**
   * Links
   * 1. Remove the gray background on active links in IE 10.
   * 2. Text-decoration should be opt-in for links.
   * 3. Nicer text-decoration where available
   */
  + 'a{'
  + 'background-color:transparent;' // 1
  + 'text-decoration:none;' // 2
  + '-webkit-text-decoration-skip:skip;' // 3
  + 'text-decoration-skip:ink;' // 3
  + '}'
  /** make links inherit their ansestor's color by default */
  + 'a,'
  + 'a:visited,'
  + 'a:hover,'
  + 'a:active,'
  + 'a:focus{'
  + 'color: inherit;'
  + '}'
  /**
   * abbr element
   * 1. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
   */
  + 'abbr[title]{'
  + 'text-decoration:underline;'
  + 'text-decoration:underline dotted;'
  + '}'
  /**
   * address elements
   * 1. Remove opinionated italics
   */
  + 'address{'
  + 'font-style: normal;'
  + '}'
  /**
   * Set the `font-weight` of `<b>` and `<strong>` elements to `700`
   * strong, b elements
   * instead of the relative `bolder`.
   */
  + 'b,'
  + 'strong{'
  + 'font-weight:700;'
  + '}'
  /**
   * mark elements
   * Set the color of `<mark>` elements in accordance with the brand color palette
   */
  + 'mark{'
  + `background-color:${getColor('highlight')};`
  + `color:${getColor('bodyText')};`
  + '}'
  /*
   * selection pseudo element
   * Remove the text shadow on text selections
   * 1. Restore the coloring undone by defining the text shadow
   */
  + '::-moz-selection{'
  + `background-color:${getColor('highlight')};` // 1
  + `color:${getColor('bodyText')};` // 1
  + 'text-shadow:none;'
  + '}'
  + '::selection{'
  + `background-color:${getColor('highlight')};` // 1
  + `color:${getColor('bodyText')};` // 1
  + 'text-shadow:none;'
  + '}'
  + '::-webkit-scrollbar-thumb {'
  + 'background: red;'
  + 'border-radius: 10px;'
  + '}'
  /**
   * Embedded media elements
   * Make media elements align to the vertical middle instead of the baseline.
   * Fixes annoying whitespace issues beneath these elements.
   */
  + 'audio,'
  + 'canvas,'
  + 'iframe,'
  + 'img,'
  + 'svg,'
  + 'video{'
  + 'vertical-align:middle;'
  + '}'
  /**
   * SVG elements
   * 1. Change the fill color to match the text color in all browsers
   * 2. Hide the overflow in IE.
   */
  + 'svg{'
  + 'fill:currentColor;' // 1
  + '}'
  + 'svg:not(:root){'
  + 'overflow:hidden;' // 2
  + '}'
  /**
   * tables
   * Collapse border spacing
   */
  + 'table{'
  + 'border-collapse:collapse;'
  + 'border-spacing:0;'
  + '}'
  /**
   * Form elements
   * Indicate clickability
   */
  + 'label,'
  + 'input,'
  + 'button,'
  + 'select,'
  + 'option,'
  + '[role="button"],'
  + '[aria-controls]{' // Yes, aria affect this too
  + 'cursor:pointer;'
  + '}'
  /**
   * Indicate editability
   */
  + '[contenteditable]:not([contenteditable="false"]),'
  + 'input[type="email"],'
  + 'input[type="email"]:active,'
  + 'input[type="password"],'
  + 'input[type="password"]:focus,'
  + 'input[type="password"]:active,'
  + 'input[type="search"],'
  + 'input[type="search"]:focus,'
  + 'input[type="search"]:active,'
  + 'input[type="text"],'
  + 'input[type="text"]:focus,'
  + 'input[type="text"]:active'
  + 'textarea,'
  + 'textarea:active,'
  + 'textarea:focus{'
  + 'cursor:text;'
  + 'outline:none;'
  + '}'
  /**
   * Inherit styling from parent
   */
  + 'button,'
  + 'input,'
  + 'select,'
  + 'textarea{'
  + 'color:inherit;'
  + 'font-size:inherit;'
  + 'line-height:inherit;'
  + 'font-family:inherit;'
  + '}'
  /**
   * Remove appearance
   */
  + 'input,'
  + 'button,'
  + 'select,'
  + 'textarea{'
  + '-moz-appearance:none;'
  + '-webkit-appearance:none;'
  + 'appearance:none;'
  + 'border:0;'
  + '}'
  /**
   * Buttons
   * 1. Make do with user-agent spacing
   * 2. Correct the inability to style clickable types in iOS and Safari.
   */
  + 'button,'
  + '[type="button"],'
  + '[type="reset"],'
  + '[type="submit"]{'
  + 'background-color:transparent;'
  + 'border:0;'
  + 'color:inherit;'
  + '}'
  /**
   * Focused buttons
   * Remove the inner border and padding in Firefox.
   */
  + 'button::-moz-focus-inner,'
  + '[type="button"]::-moz-focus-inner,'
  + '[type="reset"]::-moz-focus-inner,'
  + '[type="submit"]::-moz-focus-inner{'
  + 'border-style:none;'
  + 'padding:0;'
  + 'outline:none;'
  + '}'
  /**
   * 1. Remove the default vertical scrollbar in IE.
   */
  + 'textarea{'
  + 'overflow:auto;' // 1
  + '}'
  /**
   * Checkboxes and redio buttons
   * 1. Add the correct box sizing in IE 10-.
   * 2. Remove the padding in IE 10-.
   */
  + '[type="checkbox"],'
  + '[type="radio"]{'
  + 'box-sizing:border-box;' // 1
  + 'padding:0;' // 2
  + '}'
  /**
   * Number inputs
   * Correct the cursor style of increment and decrement buttons in Chrome.
   */
  + '[type="number"]::-webkit-inner-spin-button,'
  + '[type="number"]::-webkit-outer-spin-button{'
  + 'height:auto;'
  + '}'
  /**
   * Search inputs
   * Correct the outline style in Safari.
   */
  + '[type="search"]{'
  + 'outline-offset:-2px;'
  + '}'
  /**
   * summary element
   * Add the correct display in all browsers.
   */
  + 'summary{'
  + 'display:list-item;'
  + '}'
  /**
   * template element
   * Add the correct display in IE.
   */
  + 'template{'
  + 'display:none;'
  + '}'
  /**
   * Remove the tapping delay on clickable elements
   */
  + 'a,'
  + 'area,'
  + 'button,'
  + 'input,'
  + 'label,'
  + 'select,'
  + 'summary,'
  + 'textarea,'
  + '[tabindex]{'
  + '-ms-touch-action:manipulation;'
  + 'touch-action:manipulation;'
  + '}'
  /**
   * Hide element with [hidden]
   */
  + '[hidden]{'
  + 'display:none;'
  + '}'
  /**
   * aria-busy
   * Change the cursor on busy elements (opinionated).
   */
  + '[aria-busy="true"]{'
  + 'cursor:progress;'
  + '}'
  /*
   * [aria-controls]
   * Change the cursor on control elements (opinionated).
   */
  + '[aria-controls]{'
  + 'cursor:pointer;'
  + '}'
  /*
   * Make [hidden][aria-hidden="false"] visually hidden instead of `display:none`
   */
  + '[aria-hidden="false"][hidden]:not(:focus){'
  + 'border:0;'
  + 'clip:rect(0 0 0 0);'
  + 'clipPath:inset(50%);'
  + 'height:1px;'
  + 'margin:-1px;'
  + 'overflow:hidden;'
  + 'padding:0;'
  + 'position:absolute;'
  + 'width:1px;'
  + 'whiteSpace:nowrap;'
  + '}'
  /*
   * [aria-disabled]
   * Change the cursor on disabled elements.
   */
  + '[disabled]:not([disabled="false"]),'
  + '[aria-disabled]{'
  + 'cursor:not-allowed;'
  + '}';

export default styles;
