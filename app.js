const createError = require('http-errors');
const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/// Router
const indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const helmet = require('helmet'); // 设置各种http头
const cors = require('cors'); // 解决跨域问题

/// i18n 国际化
const i18n = require('i18n');

i18n.configure({
    locales: ['en-US', 'zh-CN', 'zh-TW'],
    defaultLocale: 'zh-CN',
    cookie: 'local',
    directory: __dirname + '/i18n',
    indent: "\t",
    extension: '.js',
    objectNotation: true,
    register: global,
    autoReload: true,
})

app.use(cookieParser());

app.use(i18n.init); //// 设置i18n
app.use(helmet()); ////设置各种HTTP头
app.use(cors());   ////解决跨域问题

/// 全局拦截器
app.use(function (req, res, next) {
    let local;
    if (req.user) {
        local = req.user.locale;
    }
    // 获取cookie中的locale数据
    else if (req.signedCookies['local']) {
        local = req.signedCookies['local'];
    }
    // 获取浏览器第一个偏好语言，这个函数是express提供的
    // else if (req.acceptsLanguages() && /zh/.test(req.acceptsLanguages())) {
    //     local = 'zh-CN';
    // }
    else {
        local = 'en-US';
    }
    // 如果cookie中保存的语言偏好与此处使用的语言偏好不同，更新cookie中的语言偏好设置
    if(req.signedCookies['local'] !== local){
        // res.cookie('local', local, { signed: true, httpOnly: true });
    }
    req.setLocale(local);
    next();
})


/// session start ///
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const identityKey = 'skey';

app.use(session({
    name: identityKey,
    secret: 'chyingp',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 10 * 1000  // 有效期，单位是毫秒
    }
}));
/// session end ///

// Set up mongoose connection
const mongoose = require('mongoose');
// root:bbz358713@
const dev_db_url = 'mongodb://localhost/sanxin';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true}).catch(error=>{
    console.log('err====>', error);
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error.html', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// 使用art-template模板渲染
const artTemplate = require('express-art-template')
artTemplate.template.defaults.imports.toString = (value) => {
    return value.toString();
}
app.engine('html', artTemplate);
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});


app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// TODO: 资源引入问题
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
});

module.exports = app;
