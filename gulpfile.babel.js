'use strict'

import gulp from 'gulp'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import prefix from 'gulp-autoprefixer'
import cp from 'child_process'
import pug from 'gulp-pug'
import ts from 'gulp-typescript'
import yarn from 'gulp-yarn'
import standard from 'gulp-standard'

let messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
}

const paths = {
  markup: {
    src: '_pug/**/*.pug',
    dest: '.'
  },
  styles: {
    src: '_scss/stylesheet.scss',
    dest: 'css'
  },
  scripts: {
    src: '_ts/**/*.ts',
    dest: 'js'
  }
}

/**
 * Gulp Task for pug compilation
 */
const markup = () => gulp.src(paths.markup.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.markup.dest))
    .pipe(browserSync.reload({stream: true}))

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
const styles = () => gulp.src(paths.styles.src)
    .pipe(sass({
      includePaths: ['scss/stylesheet.css'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream: true}))

/**
 * Gulp Task for TypeScript compilation
 */
export function scripts () {
  let tsProject = ts.createProject('tsconfig.json')

  return tsProject.src() // instead of gulp.src(...)
        .pipe(tsProject()).js
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({stream: true}))
}

/**
 * Build the Jekyll Site
 */
export function jekyllBuild (done) {
  browserSync.notify(messages.jekyllBuild)
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
        .on('close', done)
}

/**
 * Rebuild Jekyll & do page reload
 */
const jekyllRebuild = gulp.series(jekyllBuild, function () {
  browserSync.reload()
})

/**
 * Wait for jekyll-build, then launch the Server
 */
const browser = () => browserSync({
  server: {
    baseDir: '_site'
  }
})

const format = () => gulp.src(['./gulpfile.babel.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 * Also, the same for TypeScript files.
 */
export function watch () {
  gulp.watch([paths.styles.src], gulp.series(styles, jekyllRebuild))
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], jekyllRebuild)
  gulp.watch([paths.markup.src], gulp.series(markup, jekyllRebuild))
  gulp.watch([paths.scripts.src], gulp.series(scripts, jekyllRebuild))
}

/**
 * Yarnfile generation task.
 */
const yarnShrinkwrap = () => gulp.src('package.json')
    .pipe(yarn())

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
const preproccess = gulp.parallel(styles, markup, scripts)
const build = gulp.series(preproccess, jekyllBuild, yarnShrinkwrap, format)
const watchTask = gulp.series(build, browser, watch)

export {markup, styles, jekyllRebuild, browser, yarnShrinkwrap, preproccess, build, watchTask}
export default watchTask
