let gulp        = require('gulp');
let browserSync = require('browser-sync');
let sass        = require('gulp-sass');
let prefix      = require('gulp-autoprefixer');
let cp          = require('child_process');
let jade        = require('gulp-jade');
let ts          = require('gulp-typescript');
let shrinkwrap  = require('gulp-shrinkwrap');
let yarn        = require('gulp-yarn');

let jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
let messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

const paths = {
    markup: {
        src: '_jade/**/*.jade',
        dest: '.'
    },
    styles: {
        src: '_scss/**/*.scss',
        dest: 'css'
    },
    scripts: {
        src: '_ts/**/*.ts',
        dest: 'js'
    }
};

/**
 * Gulp Task for jade compilation
 */
const markup = () => gulp.src(paths.markup.src)
    .pipe(jade())
    .pipe(gulp.dest(paths.markup.dest))
    .pipe(browserSync.reload({stream: true}));

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
const styles = () => gulp.src(paths.styles.src)
    .pipe(sass({
        includePaths: ['scss'],
        onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream: true}));

/**
 * Gulp Task for TypeScript compilation
 */
export function scripts() {
    let tsProject = ts.createProject('tsconfig.json');

    return tsProject.src() // instead of gulp.src(...)
        .pipe(tsProject()).js
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({stream: true}))
}

/**
 * Build the Jekyll Site
 */
export function jekyllBuild(done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
        .on('close', done);
}

/**
 * Rebuild Jekyll & do page reload
 */
const jekyllRebuild = gulp.series(jekyllBuild, function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
const browser = () => browserSync({
    server: {
        baseDir: '_site'
    }
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 * Also, the same for TypeScript files.
 */
export function watch() {
    gulp.watch([paths.styles.src], gulp.series(styles, jekyllRebuild));
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], jekyllRebuild);
    gulp.watch([paths.markup.src], gulp.series(markup, jekyllRebuild));
    gulp.watch([paths.scripts.src], gulp.series(scripts, jekyllRebuild));
}

/**
 * NPM shrinkwrap task.
 */
const npmShrinkwrap = () => gulp.src('package.json')
    .pipe(shrinkwrap({
        dev: true
    }))
    .pipe(gulp.dest('.'));

/**
 * Yarnfile generation task.
 */
const yarnShrinkwrap = () => gulp.src('package.json')
    .pipe(yarn());

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
const preproccess = gulp.parallel(styles, markup, scripts);
const build = gulp.series(preproccess, jekyllBuild, npmShrinkwrap, yarnShrinkwrap);
const watchTask = gulp.series(build, browser, watch);

export {markup, styles, jekyllRebuild, browser, npmShrinkwrap, yarnShrinkwrap, preproccess, build, watchTask};
export default watchTask;