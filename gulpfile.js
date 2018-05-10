var gulp = require('gulp');
var wait = require('gulp-wait');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourceMaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var imageMin = require('gulp-imagemin');
var changed = require('gulp-changed');
var del = require('del');
var sequence = require('run-sequence');


var config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'src/js/**/*.js',
    jqueryin: 'src/js/jquery.min.js',
    bootsrapjsin: 'src/js/bootstrap.min.js',
    imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',
    boostrapin: 'node_modules/bootstrap/scss/bootstrap.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'dist/img/',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    jsoutname: 'script.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js'
  };
  

gulp.task('reload', function(){
    browserSync.reload();
})

gulp.task('serve', ['sass'], function(){
    browserSync({
        server: config.src
    });
    gulp.watch([config.boostrapin, config.scssin], ['sass']);
    gulp.watch([config.htmlin, config.jsin] ['reload']);
});

gulp.task('sass', function(){
    return gulp.src([config.boostrapin, config.scssin])
    .pipe(wait(200))
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function(){
    return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCss())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function(){
    return gulp.src([config.jqueryin, config.bootsrapjsin, config.jsin])
    .pipe(concat(config.jsoutname))
    .pipe(uglify())
    .pipe(gulp.dest(config.jsout));
});

gulp.task('html', function(){
    return gulp.src(config.htmlin)
        .pipe(htmlReplace({
            'css': config.cssreplaceout,
            'js': config.jsreplaceout
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.htmlout));
});

gulp.task('img', function(){
    return gulp.src(config.imgin)
        .pipe(changed(config.imgout))
        .pipe(imageMin())
        .pipe(gulp.dest(config.imgout));
})

gulp.task('clean', function(){
    return del([config.htmlout]);
});

gulp.task('build', function(){
    sequence('clean', ['html', 'js', 'css' , 'img']);
});

gulp.task('default', ['serve']);