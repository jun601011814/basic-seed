### gulp依赖说明

```javascript
{
  "gulp-babel": "^7.0.1", // babel转换
  "gulp-cache": "^1.0.2", // 缓存（可加快每次重新编译速度）
  "gulp-clean": "^0.4.0", // 文件清理
  "gulp-htmlmin": "^4.0.0", // html压缩
  "gulp-imagemin": "^4.1.0", // 图片压缩
  "gulp-less": "^4.0.0", // less编译器
  "gulp-load-plugins": "^1.5.0", // gulp插件自动加载
  "gulp-plumber": "^1.2.0", // 与gulp-less搭配使用，防止less报错终止gulp任务
  "gulp-postcss": "^7.0.1", // postcss编译器
  "gulp-rename": "^1.2.2", // 重命名文件
  "gulp-replace": "^0.6.1", // 正则替换，用于修改html内的文件引用路径
  "gulp-sass": "^4.0.1", // sass编译器
  "gulp-sequence": "^1.0.0", // 任务同步控制器
  "gulp-uglify": "^3.0.0", // js压缩
  "gulp-util": "^3.0.8" // 工具，目前使用log
}
```

### 配置css编译环境

1. 找到配置文件：build/gulp.config.js
2. 修改cssLang变量
```javascript
const cssLang = 'cssnext' // css编译器：scss || less || cssnext
```
3. 重新运行gulp命令即可

### 样式文件目录说明
1. modules目录存放变量、混合宏等不生成css代码的文件
2. partials目录存放布局、模块、icon、按钮、元件等在入口文件引入并生成css代码的文件
3. style.less为默认入口文件
