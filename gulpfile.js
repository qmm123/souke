/**
 * @description gulp 传统方式(前后端不分离)开发解决方案
 * @author      高同檩
 */

// 目录输出地址字符串拼接
var src_url = "src/";
var dist_url  = "dist/";

// =sftp配置
var release_ftp = {
    host: "192.168.1.10",  //主机名
    user: "xiaohe",  //用户名
    pass: "Wfzf6&uoxGwzcpvA4+eRgiuMbH6oZv^P^C",  //密码
    port: 22, //端口号
    remotePlatform: "linux",
    remotePath: '/home/xiaohe/www/file/cdn/souke_cdn'  //输出根目录--根据项目替换
}

// 获取gulp
var gulp = require("gulp");
var path = require("path");

// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
// 获取 gulp-less 模块（用于编译less）
var less = require('gulp-less');
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css');
// 获取 gulp-file-include 模块（用于复用html结构）
var fileinclude  = require('gulp-file-include');
// 获取 gulp-sourcemaps 模块（生产map）
var sourcemaps = require('gulp-sourcemaps');
// 获取 gulp-concat 模块（合并js）
var concat = require('gulp-concat');

// 获取 del 模块（删除文件或者文件夹）
var del = require('del');
// 获取 gulp-clean 模块（删除文件或者文件夹）
var clean = require('gulp-clean');
// 获取 gulp-connect 模块（搭建本地服务器）
var connect = require('gulp-connect');
// 获取 gulp-ftp 模块（推送代码到目标服务器）
var ftp = require('gulp-sftp');
//获取changed模块
var changed = require('gulp-changed');
var  lessChanged = require('gulp-less-changed');
// 解决有依赖的事件顺序
var runSequence = require('run-sequence');
//引入browsweSync 
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
// 模拟ajax请求
var mockServer = require('gulp-mock-server');

// =======项目搬迁新增模块
// gulp if
var gulpif = require("gulp-if");
// 定义gulp环境变量
var minimist = require("minimist");
var knownOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  }
};
var gulpEnv = minimist(process.argv.slice(2), knownOptions);
// 配置less自动补全css前缀
var LessAutoprefix = require("less-plugin-autoprefix");
var autoprefix = new LessAutoprefix({
  browsers: [
    "ie >= 8",
    "ie_mob >= 10",
    "ff >= 26",
    "chrome >= 30",
    "safari >= 6",
    "opera >= 23",
    "ios >= 5",
    "android >= 2.3",
    "bb >= 10"
  ],
  cascade: true
});

// ******************************************* 编译配置 *******************************************

// ==压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src([src_url + 'js/**.*', src_url + 'js/**/**.*', src_url + 'js/**/**/**.*', '!' + src_url + 'js/{**_no}.js'])
    // 3. 另存压缩后的文件
        .pipe(gulp.dest(dist_url + "js"))
})
// 下两个方法用于生产环境的编译
gulp.task('scriptCssImg', function() {
    gulp.src([src_url + 'js/**.{css,jpg,png,gif}', src_url + 'js/**/**.{css,jpg,png,gif}', src_url + 'js/**/**/**.{css,jpg,png,gif}'])
        .pipe(gulp.dest(dist_url + "js"))
        .pipe(connect.reload());
})
gulp.task('scriptMini', function() {
    gulp.src([src_url + 'js/**.js', src_url + 'js/**/**.js', src_url + 'js/**/**/**.js', '!' + src_url + 'js/{**_no,page_**}.js'])
        .pipe( gulpif( gulpEnv.env === "production", uglify() ) )
        .pipe(gulp.dest(dist_url + "js"))
        .pipe(connect.reload());
})
// ==编译less
// 在命令行输入 gulp less 启动此任务
gulp.task('less', function () {
    // 1. 找到 less 文件
    return gulp.src([src_url + 'less/**.less', src_url + 'less/**/**.less', '!' + src_url + 'less/{**_no,variable}.less', '!' + src_url + 'less/{common,component,Ku,pages,style,variable}/**.less'])
        .pipe(sourcemaps.init())
        .pipe( less( {plugins: [autoprefix]} ) )
        .pipe( gulpif( gulpEnv.env === "production", minifyCSS() ) )
        .pipe( gulpif( gulpEnv.env === "development", sourcemaps.write('../map_css') ) )
        .pipe(gulp.dest(dist_url + 'css'))
        .pipe(connect.reload());
});
gulp.task('lessTask',['less'],function(){
    reload();
});
// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    console.log( path.resolve(src_url + "img", "**") )
    // 1. 找到图片
    gulp.src([src_url + 'img/**'])
    // 2. 压缩图片
        // .pipe(imagemin({
        //     progressive: true
        // }))
    // 3. 另存图片
        .pipe(gulp.dest(dist_url + "img"));
        reload();
});

// ==引入html结构组件
gulp.task('fileinclude', function() {
   return gulp.src([src_url + '**.html', src_url + 'view/**.html'], {base: src_url})
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
    .pipe(gulp.dest(dist_url))
});
gulp.task('html',['fileinclude'],function(){
    reload();
});
// ==合并js文件
gulp.task('jsConcat', function () {
    gulp.src(src_url + 'js/page_**.js')
        .pipe(sourcemaps.init())
        .pipe(concat('page.min.js'))//合并后的文件名
        .pipe( gulpif( gulpEnv.env === "production", uglify() ) )
        .pipe( gulpif( gulpEnv.env === "development", sourcemaps.write("../map_js") ) )
        .pipe(gulp.dest(dist_url + 'js'));
    reload();
});

// ******************************************* 编译配置end *******************************************

// ******************************************* 本地server配置 *******************************************

// gulp.watch 监听文件改变配置
function gulpWatch(){
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch([src_url + 'js/**.*', src_url + 'js/**/**.*', src_url + 'js/**/**/**.*'], ['script']);
    // 监听文件修改，当文件被修改则执行 less 任务
    gulp.watch([src_url + 'less/**.less', src_url + 'less/**/**.less'], ['lessTask']);
    // 监听文件修改，当文件被修改则执行 css 任务
    gulp.watch([src_url + 'img/**'], ['images']);
    // 监听文件修改，当文件被修改则执行 fileinclude 任务
    gulp.watch([src_url + '**.html', src_url + 'view/**.html', src_url + 'include/**.html'], ['html']);
    // 监听文件修改，当文件被修改则执行 jsConcat 任务
    gulp.watch([src_url + 'js/page_**.js'], ['jsConcat']);
}
// ==启用browserSync本地服务器配置--推荐使用（体验好）
gulp.task('server',['script', 'jsConcat', 'lessTask', 'images', 'fileinclude'], function() {
    browserSync.init({
        port:9061,//定义端口
        browser: ["chrome"],//默认chrome打开文件
        logLevel: "info",//链接服务器显示基本信息
        server: dist_url,//监听当前文件夹
        directory:true,
        logPrefix: "搜课PC",//更改修改日志主题部分
        // startPath: "wv_tengy_login_sign.html",//默认打开文件
        /*定义远程调试的端口*/
        ui: {
            port: 9062,
            weinre: {
                port: 9062
            }
        }
    });
    // 在命令行使用 gulp auto 启动此任务
    // 监听文件修改
    gulpWatch();
});

// 使用 gulp.task('default') 定义默认任务
gulp.task('default', ['server']);
// 生产环境编译文件
gulp.task('productionDest', ['scriptCssImg', 'scriptMini', 'jsConcat', 'lessTask', 'images', 'fileinclude']);

// ==模拟ajax请求本地服务器配置--推荐有异步请求的情况使用（其它情况不推荐使用，因为体验不好，less&js 编译时间较长）
gulp.task('mock', ['script', 'jsConcat', 'lessTask', 'images', 'fileinclude'], function() {
    gulp.src(dist_url)
        .pipe(mockServer({
        // host: 'static.jwb.com',
        port: 9061,
        mockDir: src_url + 'Ajaxs',
        directoryListing: {
            enable:true,
            path: dist_url
        }
    }));
    // 在命令行使用 gulp auto 启动此任务
    // 监听文件修改
    gulpWatch();
});
// mock服务模拟假数据
gulp.task('mockdata', ['mock']);


// ******************************************* 本地server配置end *******************************************

// ******************************************* 删除文件配置 *******************************************

// ==删除文件操作--gulp-clean
gulp.task('clean_file_clean', function () {
    gulp.src(dist_url, {read: false})
        .pipe(clean({force: true}));
})
// ==删除文件操作--del
gulp.task('clean_file_del', function () {
        del([dist_url]);
})

// ******************************************* 删除文件配置end *******************************************

// =========================================== 推送文件到本地研发服务器(用于开发套页面的代码)

// 发布css
gulp.task('ftp_css', function () {
    return gulp.src(dist_url + 'css/{**,**/*}.css')
        .pipe(ftp({
            host: release_ftp.host,
            user: release_ftp.user,
            pass: release_ftp.pass,
            port: release_ftp.port,
            remotePath: release_ftp.remotePath + '/css',
            remotePlatform: release_ftp.remotePlatform
        }))
});
// 发布js
gulp.task('ftp_js', function () {
    return gulp.src([dist_url + 'js/{**,**/**,**/**/**}.*', '!' + dist_url + 'js/{**_no,page_**}.js'])
        .pipe(ftp({
            host: release_ftp.host,
            user: release_ftp.user,
            pass: release_ftp.pass,
            port: release_ftp.port,
            remotePath: release_ftp.remotePath + '/js',
            remotePlatform: release_ftp.remotePlatform
        }))
});
// 发布图片
gulp.task('ftp_img', function () {
    return gulp.src(dist_url + 'img/{**,**/**}.*')
        .pipe(ftp({
            host: release_ftp.host,
            user: release_ftp.user,
            pass: release_ftp.pass,
            port: release_ftp.port,
            remotePath: release_ftp.remotePath + '/img',
            remotePlatform: release_ftp.remotePlatform
        }))
});
// 在命令行使用 gulp ftp 启动此任务
gulp.task('ftp', function (callback) {
    runSequence('ftp_css','ftp_js','ftp_img',callback);
});

// ******************************************* 发布配置end *******************************************