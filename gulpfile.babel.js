import 'babel-register'
import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins' // 自动引入gulp插件（非gulp插件必须手动引入）
const $ = loadPlugins()

// css相关
import px2rem from 'postcss-px2rem'
import autoprefixer from 'autoprefixer'
import cssnext from 'postcss-cssnext'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import cssnano from 'cssnano' // 压缩css


// image相关
import pngquant from 'imagemin-pngquant'  // 图片深度压缩

// 其他
import browserSync from 'browser-sync' // 本地实时测试工具，用于启动一个热更新服务器
import config from './build/gulp.config' // 配置文件

// postcss配置
const processors = [
  postcssImport,
  postcssUrl,
  config.cssLang === 'cssnext' ? cssnext({
    features: {
      autoprefixer: {
        cascade: false,
        browsers: config.postcss.browsers
      }
    }
  }) : autoprefixer({
    cascade: false,
    browsers: config.postcss.browsers
  }),
  px2rem({ remUnit: 75 })
]

gulp.task('clean', () => {
  $.util.log('======== 正在清理文件 ========')
  return gulp.src(config.dist.root)
      .pipe($.clean())
})

gulp.task('html', () => {
  $.util.log('======== 正在编译html文件 ========')
  const cssExt = config.env === 'production' ? '.min.css' : '.css'
  let stream = gulp.src(config.src.html).pipe(
    $.replace(
      new RegExp('<link\s*.*href=".*(\.' + config.cssLang + ')"\s*.*\/?>', 'g'),
      match => {
        return match.replace(new RegExp('\/' + config.cssLang + '\/', 'g'), '/css/').replace(new RegExp('\.' + config.cssLang, 'g'), cssExt)
      }
    )
  )


  if (config.env === 'production') {
    stream = stream.pipe(
      $.replace(
        new RegExp('<script\s*.*src=".*(\.js)"\s*.*?><\/script>', 'g'),
        match => {
          return match.replace('.js', '.min.js')
        }
      )
    )
  }

    return stream.pipe(gulp.dest(config.dist.html))
})

gulp.task('scss', () => {
  $.util.log('======== 正在编译scss文件 ========')
  const sassOptions = {
    outputStyle: 'expanded'
  }
  return gulp.src(config.src.scss, { base: config.src.root + '/scss' })
      .pipe($.sass(sassOptions)).on('error', $.sass.logError)
      .pipe($.postcss(processors))
      .pipe(gulp.dest(config.dist.css))
})

gulp.task('less', () => {
  $.util.log('======== 正在编译less文件 ========')
  return gulp.src(config.src.less, { base: config.src.root + '/less' })
      .pipe($.plumber())
      .pipe($.less())
      .pipe($.postcss(processors))
      .pipe(gulp.dest(config.dist.css))
})

gulp.task('cssnext', () => {
  $.util.log('======== 正在编译css文件 ========')
  return gulp.src(config.src.cssnext, { base: config.src.root + '/css' })
      .pipe($.postcss(processors))
      .pipe(gulp.dest(config.dist.css))
})

gulp.task('script', () => {
  $.util.log('======== 正在编译js文件 ========')
  return gulp.src(config.src.script)
      .pipe($.cache($.babel())) // 如果有添加commonjs等模块化插件，将cache插件去除，防止被引入的js文件修改，不触发引用文件的重新编译
      .pipe(gulp.dest(config.dist.script))
})

gulp.task('image', () => {
  $.util.log('======== 正在压缩图片 ========')
  return gulp.src(config.src.image)
      .pipe($.cache($.imagemin({
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
      })))
      .pipe(gulp.dest(config.dist.image))
})

gulp.task('copy', () => {
  $.util.log('======== 正在拷贝第三方库等文件 ========')
  return gulp.src(config.src.copy, { base: config.src.root })
      .pipe(gulp.dest(config.dist.copy))
})

gulp.task('server', () => {
  $.util.log('======== 正在启动服务器 ========')
  browserSync.init({
    server: {
      baseDir: `${config.dist.root}/`
    }
  })
})

gulp.task('watch', () => {

  const tasks = {
    html: ['html'],
    css: [config.cssLang],
    script: ['script'],
    image: ['image'],
    copy: ['copy']
  }

  $.util.log('======== 开始监听文件变化 ========')
  for (let [key, item] of Object.entries(config.watch)) {
    console.log(key, '=>', item)
    const task = tasks[key]
    gulp.watch(item, e => {
      $.util.log('======== 监听到文件变化 ========')
      console.log('变化类型：', e.type)
      console.log('文件路径：', e.path)
      sequence([...task])(err => {
        if (err) console.log(err)
      })
    }).on('change', browserSync.reload)
  }
})

gulp.task('init', cb => {
  return $.sequence('html', config.cssLang, 'script', 'image', 'copy', cb)
})

gulp.task('dev', ['clean'], cb => {
  config.env = 'development'
  $.sequence('init', 'server', 'watch', cb)
})

gulp.task('compresshtml', () => {
  $.util.log('======== 正在压缩html文件 ========')
  const options = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true
  }

  return gulp.src(config.compress.html)
  .pipe($.htmlmin(options))
  .pipe(gulp.dest(config.dist.html))
})

gulp.task('compresscss', () => {
  $.util.log('======== 正在压缩css文件 ========')
  return gulp.src(config.compress.css)
  .pipe($.postcss([ cssnano ]))
  .pipe($.rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest(config.dist.css))
})

gulp.task('compressscript', () => {
  $.util.log('======== 正在压缩js文件 ========')
  return gulp.src(config.compress.script)
  .pipe($.uglify())
  .pipe($.rename({
    extname: '.min.js'
  }))
  .pipe(gulp.dest(config.dist.script))
})

gulp.task('compress', cb => {
  return $.sequence('compresshtml', 'compresscss', 'compressscript', cb)
})

gulp.task('build', ['clean'], cb => {
  config.env = 'production'
  $.sequence('init', 'compress', cb)
})

gulp.task('default', ['dev'])
