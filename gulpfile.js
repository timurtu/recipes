const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const Promise = require('bluebird')
const rimrafAsync = Promise.promisify(require('rimraf'))

const paths = {
  src: path.resolve('src'),
  dist: path.resolve('dist'),
  tether: path.resolve('node_modules/tether/dist/js/tether.min.js'),
  public: path.resolve('dist/public')
}

const allSrc = path.join(paths.src, '**/*')

gulp.task('clean', () => rimrafAsync(paths.dist))

gulp.task('copy', ['clean'], () => gulp.src([allSrc, '!**/*.js'])
  .pipe(gulp.dest(paths.dist)))

gulp.task('transpile', ['clean'], () => gulp.src(path.join(paths.src, '**/*.js'))
  .pipe(babel())
  .pipe(gulp.dest(paths.dist)))

gulp.task('tether', ['clean'], () => gulp.src(paths.tether)
  .pipe(gulp.dest(paths.public)))

gulp.task('build', ['copy', 'transpile', 'tether'])

gulp.task('watch', () => gulp.watch(allSrc, ['build']))
