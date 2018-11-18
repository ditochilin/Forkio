const gulp = require('gulp'),
	  browserSync = require('browser-sync').create(),
	  sass = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  concat = require('gulp-concat'),
      cleanCSS = require('gulp-clean-css'),
      pump = require('pump'),
      uglify = require('gulp-uglify'),
      clean = require('gulp-clean');

function cleanHtml(){
		return gulp.src('./*.html')
			.pipe(browserSync.stream());
}

// task for css
function cleanDistCss(){
		return gulp.src('./dist/css/', {read: false, allowEmpty: true})
		.pipe(clean());
}

function cleanCss(){
	return gulp.src('./src/css/', {read: false, allowEmpty: true})
			.pipe(clean({
					level: 2
					}));
}

function styleSass(){
	return gulp.src('./src/scss/**/*.scss')
			.pipe(sass()
			.on('error',function(err){
				console.log(err.toString());
				this.emit('end');
			}))
			.pipe(gulp.dest('./src/css/'));
}

function autoprefixFun(){
	return gulp.src('./src/css/**/*.css')
			.pipe(autoprefixer({
				browsers: ['> 0.1%'],
            	cascade: false
			}))
			.pipe(gulp.dest('./src/css/'));
}

function concatCss(){
	return gulp.src(['./src/css/**/*.css','./node_modules/normalize.css/normalize.css'])
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./src/css/'));	
}

function minifyCss(){
	return gulp.src('./src/css/style.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./src/css/'));
}

function copyCss(){
	return gulp.src('./src/css/style.css')
		.pipe(gulp.dest('./dist/css/'))
		.pipe(browserSync.stream());
}

gulp.task('clean-css', cleanCss);
gulp.task('sass', gulp.series('clean-css', styleSass));
gulp.task('autoprefix',gulp.series('sass', autoprefixFun));
gulp.task('concat-css',gulp.series('autoprefix', concatCss));
gulp.task('minify-css',gulp.series('concat-css', minifyCss));
gulp.task('copy-css',gulp.series('minify-css', cleanDistCss, copyCss));


// tasks for JS

function cleanDistJs(){
		return gulp.src('./dist/js/', {read: false, allowEmpty: true})
		.pipe(clean());
}

function cleanJs(){
	return gulp.src('./src/js/scriptfordist/*.js',{read: false, allowEmpty: true})
		.pipe(clean());
}

function concatJs(){
	return gulp.src('./src/js/forkiojs/*.js', {allowEmpty:true})
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./src/js/scriptfordist/'));
}

function copyJs(){
	return gulp.src('./src/js/scriptfordist/script.js', {allowEmpty:true})
		.pipe(gulp.dest('./dist/js/'))
		.pipe(browserSync.stream());
}

gulp.task('clean-js', cleanJs);
gulp.task('concat-js',gulp.series('clean-js', concatJs));
gulp.task('minify-js',gulp.series('concat-js',function (cb){
	pump([
			gulp.src('./src/js/scriptfordist/script.js'),
			uglify(),
			gulp.dest('./src/js/scriptfordist/')
		],cb);
}));
gulp.task('copy-js',gulp.series('minify-js', cleanDistJs, copyJs));

function watch(){

    browserSync.init({
       	server: {
           	baseDir: "./"
       	}
    });

	gulp.watch('./*.html', cleanHtml);
	gulp.watch('./src/scss/**/*.scss', gulp.series('copy-css'));
	gulp.watch('./src/js/forkiojs/*.js', gulp.series('copy-js'));

}

//gulp.task('serve', watch);

gulp.task('dev',gulp.series(cleanDistCss, cleanDistJs,  copyCss, copyJs, watch));


gulp.task('build', gulp.series(cleanDistCss, cleanDistJs, copyCss, copyJs));
