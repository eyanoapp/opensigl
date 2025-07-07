/* eslint-disable import/no-extraneous-dependencies */
const {
  src, dest, parallel,
} = require('gulp');
const path = require('path');

const CLIENT_FOLDER = path.resolve(__dirname, '../bin/client');
const FONT_FILES = [
  'node_modules/typeface-open-sans/files/*',
  'node_modules/font-awesome/fonts/*',
];

/**
 * @function fonts
 *
 * @description
 * Move all fonts into the fonts/ folder on the client.
 */
function fonts() {
  return src(FONT_FILES, { encoding : false })
    .pipe(dest(`${CLIENT_FOLDER}/fonts/`));
}

/**
 * @function fontsUiGrid
 *
 * @description
 * We have to treat ui-grid fonts separately because they have
 * specific references in them that break if we don't have them
 * in the CSS folder (instead of the fonts folder).
 */
function fontsUiGrid() {
  return src('node_modules/angular-ui-grid/fonts/*', { encoding : false })
    .pipe(dest(`${CLIENT_FOLDER}/css/fonts/`));
}

function fontsBootstrapIcons() {
  return src('node_modules/bootstrap-icons/font/fonts/*', { encoding : false })
    .pipe(dest(`${CLIENT_FOLDER}/css/fonts/`));
}

function fontsRemixIcons() {
  const remixFonts = [
    'node_modules/remixicon/fonts/*.ttf',
    'node_modules/remixicon/fonts/*.woff',
    'node_modules/remixicon/fonts/*.woff2',
    'node_modules/remixicon/fonts/*.svg',
  ];
  return src(remixFonts, { encoding : false })
    .pipe(dest(`${CLIENT_FOLDER}/css/`));
}

module.exports = parallel(fonts, fontsUiGrid, fontsBootstrapIcons, fontsRemixIcons);
