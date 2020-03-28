const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
    /* 用来放置favicon.ico */
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new CompressionWebpackPlugin({
                test: /\.(html|js|css)$/, // 匹配文件名
                threshold: 5120, // 对超过5k的文件进行压缩
                minRatio: 0.8,   // 只有压缩率小于这个值的资源才会被处理
                deleteOriginalAssets: true // 是否删除原文件
            }));
        }
    },
    // 修改要vue inspect > output.js来查看
    chainWebpack: config => {
        // chain要用when，能不能识别到？
        // 下面的代码没有效果 我也不知道为什么
        config.optimization.minimizer('terser').tap(args => {
            args[0].extractComments = true;
            args[0].terserOptions.compress.drop_console = true;
            args[0].terserOptions.output = {};
            args[0].terserOptions.output.beautify = false;
            args[0].terserOptions.output.comments = false;
            return args;
        });
    },
    /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
    /* publicPath对应process.env.BASE_URL */
    /* 下面那个是给github配的 */
    publicPath: process.env.BASE_URL || '/',
    /* 输出文件目录：在npm run build时，生成文件的目录名称 */
    outputDir: 'dist',
    /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
    assetsDir: "assets",
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
    filenameHashing: true,
    /* 代码保存时是否进行eslint检测 */
    lintOnSave: false,
    /* 本来要设置webpack, 在最新的vue-cli@3.x 配置中，默认已配置好pug的相关loader， 所以安装完可以直接在<template/>中使用 */
    /* https://xrkffgg.github.io/Knotes/blog/15.html#_1-介绍  pug-html-loader不是必要的 */
    /* webpack-dev-server 相关配置 */
    devServer: {
        /* 自动打开浏览器 */
        open: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        // host: 'localhost',
        // 新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的，将中断访问
        disableHostCheck: true,
        port: 8066,
        https: false,
        hotOnly: false,
        /* 使用代理 */
        proxy: {
            '/api': {
                /* 目标代理服务器地址 */
                target: 'http://localhost/',
                /* 允许跨域 */
                changeOrigin: true,
            },
        },
    },
};