const { src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');


//запуск сервера

function browsersync() {
    browserSync.init({
        server: {baseDir: 'app/'},
        notify: false,
        online: true
    });
}

//работа с JS файлами

function scripts() {
    return src(['app/js/script.js'])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream());
}

//работа с Style файлами

function styles() {
    return src('app/sass/style.sass')
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream());
}

//проверка на обновление файлов SASS, JS, HTML

function startWatch() {
    watch('app/**/*.sass', styles);
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
}

//экспорт функций

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;

//задаем дефолтный таск

exports.default = parallel(styles, scripts, browsersync, startWatch);