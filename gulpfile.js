const del = require('del');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence');

const plugins = gulpLoadPlugins();

const options = {
    dist: 'dist',
    src: 'src'
};

gulp.task('scripts', () => {
    return gulp.src(`${options.src}/js/**/*.js`)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('all.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(`${options.dist}/scripts`));
});

gulp.task('styles', () => {
    return gulp.src(`${options.src}/sass/global.scss`)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({outputStyle: 'compressed'}))
        .pipe(plugins.rename('all.min.css'))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(`${options.dist}/styles`));
});

gulp.task('images', () => {
    return gulp.src(`${options.src}/images/**/*`)
        .pipe(plugins.image())
        .pipe(gulp.dest(`${options.dist}/content`));
});

gulp.task('html', () => {
    return gulp.src(`${options.src}/index.html`)
        .pipe(gulp.dest(options.dist));
});

gulp.task('clean', () => {
    del(['dist']);
});

gulp.task('build', callback => {
    return runSequence(
        'clean',
        ['styles', 'scripts', 'images'],
        'html',
        callback
    );
});

gulp.task('serve', ['build'], () => {
    return plugins.connect.server({
        port: 3000,
        livereload: true,
        root: 'dist'
    });
});

gulp.task('watch', ['serve'], () => {
    gulp.watch(`${options.src}/js/**/*.js`, ['scripts']);
    gulp.watch(`${options.src}/sass/**/*.scss`, ['styles']);
    gulp.watch(`${options.src}/images/**/*`, ['images']);
    gulp.watch(`${options.src}/index.html`, ['html']);
    plugins.watch('dist')
        .pipe(plugins.connect.reload());
});

gulp.task('default', ['build']);
