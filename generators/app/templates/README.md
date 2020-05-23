# <%= elementName %>
<% if (description) { %>
> <%= description %>
<% } %>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Intallation](#intallation)
- [Usage](#usage)
  - [Build Process and File Structure](#build-process-and-file-structure)
    - [JavaScript](#javascript)
    - [CSS](#scss-and-css)
  - [Dev Scripts](#dev-scripts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Build Process and File Structure

This project uses Next.js to generate static pages that _DO NOT_ include React
or any of Next's client-side bundle. React is used strictly as a server-side
templating language instrumented through Next's build process for optimization.

Data is automatically consumed from polopoly by specifying URLs in the `PAGES`
array in `consts/index.js`;

To manipulate the data change the `parseData()` function in `utils/getStaticProps`.

On export, static pages will be generated in the `out` directory. A subdirectory
named after the page's `contentId` will be created for each page specified in
the `PAGES` array, with two `html` pages in it `index.html` for the regular version
and `closed.html` for the closed version.

The handling of open and closed variations should be done based on the `isClosed`
prop that is passed to the page (`pages/[id]/[filename]`).


#### JavaScript

The entrypoint for JavaScript source files is `src/index.js` which then gets consumed
in the build process to produce two bundles:

  1. A modern bundle using the latest supported syntax and optimization technologies,
     such as `modules` and code splitting through dynamic `import()` calls.
  2. A transpiled legacy bundle which is served to older browsers in syntax they
     can support.

The two bundles are automatically injected into html templates as part of the
Next.js build process (If you're interested, see `pages/_document.js`).


#### CSS

Static atomic CSS is create at build time using Fela.

Fela is not included in the client side bundle, so all states must already be
handled at build time.

Several base assumptions should be taken into consideration:

  1. `1rem` is set to `6px` by default, and `7px` in `@media (min-width: 1280px)`.
  2. The default font-size and line height inherited from the body element are
     `16px/24px` by default, and `18px/28px` in `@media (min-width: 1280px)`.
  3. Spacing should largely be thought of in terms of vertical rhythm units,
     each consisting of a single `rem`. E.g., Six spacing units will always best
     equal to `6rem`.
  4. Color should be set using css-variables and thought of as a consistent theme,
     defined in the `theme/consts/palette.js` file and consumed using the
     color method on the Fela theme object (`theme.color(color[, variant])`)
     returned from `useFela`.
  5. Font size and line height should conform to a typographic scale, and set only
     using the `type` method on the Fela theme object returned from `useFela()`.
  6. Media queries should generally be set to named breakpoints by calling the
     `mq` method on the Fela theme object returned from `useFela()`.


### Dev Scripts

The following scripts are available to aid the development process:

  * **yarn dev:** Start a development server.
  * **yarn export:** Create a production optimized build and static pages ready
    for deployment.
  * **yarn export:pre:** Create a production optimized build and static pages ready
    for deployment to the staging env.
  * **yarn deploy:** Deploy the production-optimized build and static pages
    to `https://haaretz.co.il/static-interactive/pages/<%= elementName %>`
  * **yarn deploy:pre:** Deploy the production-optimized build and static pages
    for testing purposes in the staging env to
    `https://haaretz.co.il/static-interactive/pages-pre/<%= elementName %>`
  * **yarn lint:** Lint files.
  * **yarn format:** Lint files with autofixing.
  * **yarn test:** Run tests.
  * **yarn test:watch:** Run tests in watch mode.
  * **yarn gc:** Create a commit with Commitizen.
