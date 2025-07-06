/* eslint-disable import/no-extraneous-dependencies */
// const path = require('path');
const gulpif = require('gulp-if');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const del = require('del');
const rev = require('gulp-rev');

const {
  src, dest, series, watch,
} = require('gulp');

const { isProduction, isDevelopment, CLIENT_FOLDER } = require('./util');

// paths to CSS required by different libraries
let CSS_PATHS = [
  'client/src/css/*.css',
  'node_modules/ui-select/dist/select.min.css',
  'node_modules/angular-ui-grid/ui-grid.min.css',
  'node_modules/ui-bootstrap4/dist/ui-bootstrap-csp.css',
  'node_modules/bootstrap-icons/font/bootstrap-icons.min.css',
];

// only minify if in production mode
if (isDevelopment) {
  CSS_PATHS = CSS_PATHS.map((file) => file.replace('.min.css', '.css'));
}

const SCSS_PATH = 'client/src/scss/opensigl-bootstrap.scss';

/**
 * @function cleanCSS
 *
 * @description
 * Removes previous CSS builds before beginning a new one.
 */
const cleanCSS = () => del(`${CLIENT_FOLDER}/css/opensigl`);

/**
 * @function compileCSSForProduction
 *
 * @description
 * Reads the css from the disk, compiles it, minifies it, and computes
 * revisions so that it can bust the previous cache.
 */
function compileCSSForProduction() {
  return src(CSS_PATHS)
    .pipe(concat('css/opensigl.min.css'))
    .pipe(postcss([cssnano({ zindex : false })]))
    .pipe(rev())
    .pipe(dest(CLIENT_FOLDER))
    .pipe(rev.manifest('rev-manifest-css.json'))
    .pipe(dest(CLIENT_FOLDER));
}

/**
 * @function compileCSSForDevelopment
 *
 * @description
 * Reads CSS from the disk and combines it into a single file, forgoing
 * minification or other treatments.
 */
function compileCSSForDevelopment() {
  return src(CSS_PATHS)
    .pipe(concat('css/opensigl.min.css'))
    .pipe(dest(CLIENT_FOLDER));
}

// toggle the compilation function, depending on if we are in production
// or development mode.
const compileCSS = isProduction
  ? compileCSSForProduction
  : compileCSSForDevelopment;

/**
 * @function compileSass
 * @description
 * Compiles SCSS into CSS, minifies it if in production mode,
 * and outputs it to the client CSS folder.
 * @returns
 */
function compileSass() {
  return src(SCSS_PATH)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(isProduction, postcss([cssnano({ zindex : false })])))
    .pipe(dest(`${CLIENT_FOLDER}/css`));
}

const PATHS = [...CSS_PATHS, SCSS_PATH];

const compile = series(cleanCSS, compileSass, compileCSS);
exports.watch = () => watch(PATHS, compile);
exports.compile = compile;
