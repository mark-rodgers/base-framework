var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

// Remove outdated CSS files
gulp.task('clean', function() {
  return gulp.src('src/css', { read: false })
    .pipe(clean());
});

// Optimize images for web
gulp.task('images', ['clean'], function () {
  return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'))
});

// Copy Font Awesome fonts to dist
gulp.task('fonts', ['images'], function() {
  return gulp.src(['node_modules/font-awesome/fonts/fontawesome-webfont.*'])
    .pipe(gulp.dest('./dist/fonts'));
});

// Compile SASS into CSS & auto-inject into browser
gulp.task('sass', [ 'fonts' ], function() {
  return gulp.src('src/sass/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

// Compile HTML, minify CSS and JavaScript
gulp.task('compile', [ 'sass' ], function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// Static Server + watching HTML / SASS / JavaScript files
gulp.task('serve', ['compile'], function() {
  browserSync.init({
    server: './dist',
    notify: false
  });
  gulp.watch('src/sass/**/*.scss', ['compile']);
  gulp.watch('src/js/**/*.js', ['compile']);
  gulp.watch('src/*.html', ['compile']);
});

gulp.task('default', [ 'serve' ]);
