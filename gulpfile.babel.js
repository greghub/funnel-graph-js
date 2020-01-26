import gulp from 'gulp';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import eslint from 'gulp-eslint';
import sasslint from 'gulp-sass-lint';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import streamify from 'gulp-streamify';
import uglify from 'gulp-uglify';

const server = browserSync.create();

const styles = () => {
    const plugins = [autoprefixer(), cssnano()];

    return (
        gulp.src(['./src/scss/main.scss', './src/scss/theme.scss'])
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./dist/css'))
            .pipe(postcss(plugins))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('./dist/css'))
            .pipe(server.stream())
    );
};

const scripts = () => browserify({
    entries: './index.js',
    standalone: 'FunnelGraph'
}).transform(babelify, { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source('funnel-graph.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(streamify(uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'))
    .pipe(server.stream());

const scriptsLint = () => gulp.src('./src/js/*.js')
    .pipe(eslint())
    .pipe(eslint.format());

const stylesLint = () => gulp.src('./src/scss/**/*.scss')
    .pipe(sasslint())
    .pipe(sasslint.format());

const startServer = () => server.init({
    server: {
        baseDir: './'
    }
});

const watchHTML = () => gulp.watch('./*.html').on('change', server.reload);
const watchScripts = () => gulp.watch('./src/js/*.js', gulp.series('scriptsLint', 'scripts'));
const watchStyles = () => gulp.watch('./src/scss/**/*.scss', gulp.series('stylesLint', 'styles'));

const compile = gulp.parallel(styles, scripts);
const lint = gulp.parallel(scriptsLint, stylesLint);
const serve = gulp.series(compile, startServer);
const watch = gulp.series(lint, gulp.parallel(watchHTML, watchScripts, watchStyles));
const defaultTasks = gulp.parallel(serve, watch);

export {
    styles,
    scripts,
    scriptsLint,
    stylesLint,
    watchHTML,
    watchScripts,
    watchStyles,
    startServer,
    serve,
    watch,
    compile,
    lint
};

export default defaultTasks;
