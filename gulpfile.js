var gulp = require('gulp'),
  pug = require('gulp-pug'),
  sourcemap = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  svgsprite = require('gulp-svg-sprite'),
  browsersync = require('browser-sync');


// Compile html from pug
gulp.task('html', function() {
  return gulp.src('dev/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'));
} );

// Compile css from sass
gulp.task('styles', function() {
  return gulp.src('dev/*.sass')
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: 'expanded',
      errLogToConsole: true
    }).on('error', sass.logError))
    .pipe(postcss( [
      autoprefixer( {
        browsers: ['last 2 versions'],
        cascade: true
      } )
    ] ))
    .pipe(sourcemap.write('../dev/sourcemaps/'))
    .pipe(gulp.dest('dist/'));
} );

// Create icons spritesheet
gulp.task('icons', function() {
  return gulp.src('dev/icons/*.svg')
  	.pipe(svgsprite({
      log: "info",
      shape: {
        dimension: {
          maxWidth: 48,
          maxHeight: 48,
          // precision: 12
        },
        spacing: {
          padding: 0
        }
      },
      mode: {
        css: {
          render: {
            scss: {
              template: "dev/icons/template.scss",
              dest: "icons.scss"
            }
          },
          dest: "dev/sass/",
          prefix: ".icon-%s",
          layout: "diagonal",
          sprite: "../../dist/img/icons.svg",
          bust: false,
          example: false
        }
      }
    })).on('error', function(error){ console.log(error); })
  	.pipe(gulp.dest('./'));
});



// Watch for changes
gulp.task('watch', function() {
  gulp.watch(['dev/**/*.sass', 'dev/sass/*.scss'], gulp.series('styles', reload));
	// gulp.watch('dev/images/**/*', gulp.series('images', reload));
	gulp.watch(['dev/icons/*.svg', 'dev/icons/template.scss'], gulp.series('icons', 'styles', reload));
  gulp.watch('dev/**/*.pug', gulp.series('html', reload));
});



// Local server with livereload
gulp.task('browsersync', function() {
  return browsersync.init({
    server: {
      baseDir: 'dist/',
      index: 'main.html'
    }
  });
} );
function reload(done){
  browsersync.reload();
  done();
};



// Development envirronement that watches every changes and reload the browser
gulp.task('default', gulp.series(gulp.parallel('html', gulp.series('icons', 'styles')), gulp.parallel('browsersync', 'watch')));
