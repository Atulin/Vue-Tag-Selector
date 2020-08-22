const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const Fiber = require('fibers');
const yaml = require('gulp-yaml');

// CSS processors
const autoprefixer = require('autoprefixer');
const discard = require('postcss-discard-comments');
const mqpacker = require('css-mqpacker');
const nano = require('cssnano');

// JS processors
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');
const terser = require('gulp-terser-js');

// Dirs
const dir = {
    css: {
        src: './src/css',
        dist: './dist/css'
    },
    js: {
        src: './src/js',
        dist: './dist/js'
    }
}

// CSS tasks
gulp.task('css', () => {
    const processors = [
        autoprefixer,
        discard({ removeAll: true }),
        mqpacker,
        nano({ preset: 'default' })
    ];

    return gulp.src(`${dir.css.src}/*.sass`)
        .pipe(sass({fiber: Fiber}))     // Compile SASS
        .pipe(gulp.dest(dir.css.dist))          // Output the raw CSS
        .pipe(postcss(processors))              // Postprocess it
        .pipe(rename({ suffix: '.min' }))  // Add .min suffix
        .pipe(gulp.dest(dir.css.dist))          // Output minified CSS
});

gulp.task('watch:css', () => gulp.watch('**/*.sass', gulp.series('css')));

// JS tasks
gulp.task('js', () => {
    return gulp.src(`${dir.js.src}/*.js`)
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init())
        .pipe(terser({ mangle: { toplevel: true } }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dir.js.dist));
});

gulp.task('watch:js', () => gulp.watch(`${dir.js.src}/*.js`, gulp.series('js')));

// TS tasks
gulp.task('ts', () => {
    return gulp.src(`${dir.js.src}/*.ts`)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(gulp.dest(dir.js.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(terser({ mangle: { toplevel: true } }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dir.js.dist));
});

gulp.task('watch:ts', () => gulp.watch(`${dir.js.src}/*.ts`, gulp.series('ts')))

// Data tasks
gulp.task('data', () => {
   gulp.src('./data/*.yml')
       .pipe(yaml({
           space: 4
       }))
       .pipe(gulp.dest('./data/'))
});

gulp.task('watch:data', () => gulp.watch('./data/*.yml', gulp.series('data')))

// All tasks
gulp.task('all', gulp.parallel(['css', 'js', 'ts']));
gulp.task('watch:all', gulp.parallel(['watch:css', 'watch:js', 'watch:ts']));
