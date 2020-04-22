# <%= elementName %>
<% if (description) { %>
> <%= description %>
<% } %>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Intallation](#intallation)
- [Usage](#usage)
  - [Build Process and File Structure](#build-process-and-file-structure)
    - [HTML](#html)
    - [JavaScript](#javascript)
    - [SCSS and CSS](#scss-and-css)
      - [@haaretz/sass-selectors](#haaretzsass-selectors)
      - [@haaretz/sass-type](#haaretzsass-type)
      - [mq](#mq)
  - [Dev Scripts](#dev-scripts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Build Process and File Structure

#### HTML
The `templates` directory contains html templates that are compiled at build
time into the `public` directory, where all built artifacts are placed.

The `templates` directory contains two subdirectories:

  * `partials`, in which each individual element (if you have several) is its
    own file.
  * `pages`, which, by default contains an `index.html` file, in which the
    different partials will be included.

As a rule, `index.html` is used for development purposes, while the partials
are the HTML snippets that will eventually be included into pages in production.

#### JavaScript

The entrypoint for JavaScript source files is `src/index.js` which then gets consumed
in the build process to produce two bundles:

  1. A modern bundle using the latest supported syntax and optimization technologies,
     such as `modules` and code splitting through dynamic `import()` calls.
  2. A transpiled legacy bundle which is served to older browsers in syntax they
     can support.

The two bundles are automatically injected into html templates (See
`templates/partials/01-partial1.html`) for an example of how it is done.

**NOTE:** If your project contains more than one html partial, it is crucial that
the JavaScript bundle is injected into the _last_ partial in the html. Otherwise,
make sure your code does not make any assumptions regarding the html already
present in the page.


#### SCSS and CSS

The entrypoint for SCSS files is the `src/style/styles.scss` file, which should
import all relevant partials.

A second css file, `src/style/base/reset.css`, is loaded conditionally in development
only to best simulate the production environment in which the element(s) will
eventually be displayed in without unnecessarily increasing the size of the
bundle in production.

`src/style/base/reset.css` **must never be imported** into `src/style/styles.scss`.

This project provides a minimal Sass framework, with several mixins and functions
for developer ease and style conformity.

Several base assumptions should be taken into consideration:

  1. `1rem` is set to `6px` by default, and `7px` in `@media (min-width: 1280px)`.
  2. The default font-size and line height inherited from the body element are
     `16px/24px` by default, and `18px/28px` in `@media (min-width: 1280px)`.
  3. Spacing should largely be thought of in terms of vertical rhythm units,
     each consisting of a single `rem`. E.g., Six spacing units will always best
     equal to `6rem`.
  4. Color should be set using css-variables and thought of as a consistent theme,
     defined using the `create-var` mixin and consumed using the `use-var` function
     (see [@haaretz/sass-selectors](#haaretzsass-selectors) below).
  5. Font size and light height should conform to a typographic scale, and set only
     throuh the provided `type` mixin (see [@haaretz/sass-type](#haaretzsass-type)).
  6. Interactive elements reside in what could be considered "hostile environment",
     included into pages that are already ripe with global styles. Class names
     should be prefixed using the provided BEM mixins (see
     [@haaretz/sass-selectors](#haaretzsass-selectors) below), as a preffered alternative
     to increasing specificity.

The following libraries are used to provide functions and mixins
and functions, please consult their documentation:

##### @haaretz/sass-selectors

> A library for defining and working with selectors

Provides:

 * `use-var` function for easily consuming prefixed css custom properties.
 * `create-var` mixin for easily defining prefixed css custom properties.
 * `create-var` mixin for easily defining prefixed css custom properties.

 * `b` `e` and `m` mixins for declaratively creating BEM rulesets.
 * `is` mixin for declaratively defining state qualified rulesets.

 * `when-is` mixin for declaratively qualifying selectors

See the fulle [documentation](https://github.com/Haaretz/htz-sass-selectors)
for more details and configuration options.

##### @haaretz/sass-type

> A library for working with a typographic scale using css custom properties

Provides:

 * `type` mixin for defining font-size and line-height
 * `generate-typography-custom-props` mixin to generate the custom props used by
   the type mixin

See the full [documentation](https://github.com/Haaretz/htz-sass-type) for more
details and configuration options.


##### mq

> Flexible media queries based on predefined breakpoints

An alias to the `jigsass-tools-mq` library, with a shorter name for convenience.

Provides:

  * `mq` mixin for creating media queries based `$from`, `$until`, `$misc` and
    `$media-type` params. Breakpoints for `$from`, `$until` (width) and `$misc`
    (orientation, etc) are defined in the `_vars.scss` partial, through the `$jigsass-breakpoints` variable

See the full
[documentation](https://txhawks.github.io/jigsass-tools-mq/#mixin-jigsass-mq)
for more details and configuration options.


### Dev Scripts

The following scripts are available to aid the development process:

  * **yarn dev:** Start a development server on port 5000.<br />
    Env variables:
    * `PORT`: Set the live-server port. _Default: `5000`_.
      ```sh
      PORT=8080 yarn dev
      ```

    * `HOST`: Set a host to serve from the live server. Must be one that is mapped
      to `localhost` or `127.0.0.1` in your local `hosts` file. Useful when and
      haaretz domain is needed for `CORS`. Will automatically open a browser
      window pointing to this address when defined.
      ```sh
      HOST="me.haaretz.co.il" yarn dev
      ```

    * `OPEN`: Automatically open a browser window pointing to `HOST` or `127.0.0.1`
      even if `HOST` is not defined. _Default: `false`_

      ```sh
      OPEN=true yarn dev
      ```

    * `WAIT`: Time in milliseconds to wait before reloading. _Default: `500`_

      ```sh
      WAIT=500 yarn dev
      ```

  * **yarn deploy:** Create a production-optimized build and deploy to
    _`https://haaretz.co.il/st<%= remotePath %>`_.

    This will also deploy the html (pages and partials, see [html](#html)), so
    it can be viewd in isolation and included in elements.

  * **yarn deploy:pre:** Create a production-optimized build for _testing_ and deploy
    to _`https://haaretz.co.il/st<%= remotePathPre %>`_.

    This will also deploy the html (pages and partials, see [html](#html)), so
    it can be viewd in isolation and included in elements.

  * **yarn format:** Lint files with autofixing.

  * **yarn test:** Lint files and run tests.

  * **yarn test:watch:** Run tests in watch mode.

  * **yarn gc:** Create a commit with Commitizen.
