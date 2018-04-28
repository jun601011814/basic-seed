const srcRoot = `./src`
const distRoot = `./dist`
const cssLang = `scss` // css编译器：scss || less || cssnext
const postcss = {
  browsers: [`last 4 versions`, `Android >= 4.0`]
}

const src = {
  root: srcRoot,
  html: `${srcRoot}/*.html`,
  scss: [`${srcRoot}/scss/**/*.scss`, `!${srcRoot}/scss/**/_*.scss`],
  less: [`${srcRoot}/less/**/*.less`, `!${srcRoot}/less/**/_*.less`],
  cssnext: [`${srcRoot}/css/**/*.css`, `!${srcRoot}/css/**/_*.css`],
  script: [`${srcRoot}/js/**/*.js`, `!${srcRoot}/js/**/*.min.js`],
  image: `${srcRoot}/images/**/*.{png,jpg,gif,ico}`,
  copy: [
    `${srcRoot}/libs/**/*.*`,
    `${srcRoot}/js/**/*.min.js`
  ]
}

const dist = {
  root: distRoot,
  html: `${distRoot}/`,
  css: `${distRoot}/css`,
  script: `${distRoot}/js`,
  image: `${distRoot}/images`,
  copy: distRoot
}

const watch = {
  html: src.html,
  css: cssLang === 'cssnext' ? `${srcRoot}/css/**/*.css` : `${srcRoot}/${cssLang}/**/*.${cssLang}`,
  script: src.script,
  image: `${srcRoot}/images/**/*`,
  copy: src.copy
}

const compress = {
  html: `${distRoot}}/*.html`,
  css: `${distRoot}/css/**/*.css`,
  script: [`${distRoot}/js/**/*.js`, `!${distRoot}/**/*.min.js`]
}

export default {
  env: 'development',
  cssLang,
  postcss,
  src,
  dist,
  watch,
  compress
}
