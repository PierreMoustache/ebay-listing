var gulp = require('gulp'),
  pug = require('gulp-pug'),
  sourcemap = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  svgsprite = require('gulp-svg-sprite'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  browsersync = require('browser-sync');


// Compile html from pug
gulp.task('html', function() {
  return gulp.src('src/*.pug')
    .pipe(cache(pug({
      pretty: true
    })))
    .pipe(gulp.dest('dist/'));
} );

// Compile css from sass
gulp.task('styles', function() {
  return gulp.src('src/*.sass')
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
    .pipe(sourcemap.write('../src/sourcemaps/'))
    .pipe(gulp.dest('dist/'));
} );

// Create icons spritesheet
gulp.task('icons', function() {
  return gulp.src('src/icons/*.svg')
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
              template: "src/icons/template.scss",
              dest: "icons.scss"
            }
          },
          dest: "src/sass/",
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

// Compress images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    // .pipe(cache('imgcache'))
    .pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
      verbose: true
		})))
    .pipe(gulp.dest('dist/img/'));
});



// Watch for changes
gulp.task('watch', function() {
  gulp.watch(['src/**/*.sass', 'src/sass/*.scss'], gulp.series('styles', reload));
	gulp.watch('src/images/**/*', gulp.series('images', reload));
	gulp.watch(['src/icons/*.svg', 'src/icons/template.scss'], gulp.series('icons', 'styles', reload));
  gulp.watch('src/**/*.pug', gulp.series('html', reload));
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
gulp.task('default', gulp.series(gulp.parallel('images', 'html', gulp.series('icons', 'styles')), gulp.parallel('browsersync', 'watch')));
