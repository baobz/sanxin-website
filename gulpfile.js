const gulp = require('gulp');
const del = require('del');

const less = require('gulp-less');
const minify = require('gulp-clean-css');
// const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence'); // 顺序执行task任务
const plumber = require('gulp-plumber'); // 有错误不停止程序

// 启动express
gulp.task('node', ()=>{
    nodemon({
        script: './bin/www',
        ext: 'js html css',
        env: { 'NODE_ENV': 'development' }
    })
})

// 删除文件
gulp.task('clean', async () => {
    await del(['dist/']);
});

// less编译+压缩
gulp.task('less', () => {
    return gulp.src([
        'public/stylesheets/reset.css',
        'public/stylesheets/common.css',
        'public/stylesheets/less/*.less'
    ])
        .pipe(plumber())
        .pipe(less())
        .pipe(minify())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('dist/css/'))
});

// 压缩img
gulp.task('img', () => {
    return gulp.src('public/images/**/*')
    //压缩图片
        .pipe(plumber())
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/images/'))
});

// 不需要处理的文件直接复制
gulp.task('copy', () => {
    return gulp.src('public/lib/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/lib/'))
});

// 启动服务
gulp.task('serve', ['node'],() => {
    browserSync.init({
        proxy: 'localhost:8080', // 指定代理url
        notify: false, // 刷新不弹出提示
        port: 3001,
    });
    // 监听less文件编译
    gulp.watch('public/stylesheets/**/*', ['less']).on('change', reload);
    gulp.watch('public/lib/**/*', ['copy']).on('change', reload);
    gulp.watch('public/images/**/*',['img']).on('change',reload);
    gulp.watch('views/**/*').on('change',reload);
    console.log('watching...');

});

gulp.task('default', () =>{
    runSequence('clean', ['less', 'img', 'copy'], 'serve')
});
