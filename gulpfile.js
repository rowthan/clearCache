/**
 * Created by rowthan on 2017/5/17.
 */
var gulp = require('gulp');
var uncss = require('gulp-uncss');
var cleanCSS = require('gulp-clean-css');
gulp.task('default', function () {
    return gulp.src('css/options.css')
        .pipe(cleanCSS())
        .pipe(uncss({
            html: ['options.html']
        }))
        .pipe(gulp.dest('./style'));
});