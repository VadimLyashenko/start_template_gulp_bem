var gulp 	  		 = require('gulp'),
		sass 	  		 = require('gulp-sass'),
		notify  		 = require('gulp-notify'),
		autoprefixer = require('gulp-autoprefixer'),
		concat       = require('gulp-concat'),
		uglify 			 = require('gulp-uglify'),
		cache 			 = require('gulp-cache'),
		imagemin		 = require('gulp-imagemin'),
		browserSync  = require('browser-sync'),
		del          = require('del'),
		rename       = require('gulp-rename'),
		cleanCSS     = require('gulp-clean-css');

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src(['app/libs/jquery/dist/jquery.min.js',
	'app/js/common.js'])
	.pipe(concat('scripts.min.js'))
	//Минификацая js
	//.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function(){
		var buildFiles = gulp.src([
		'app/*.html',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.css',
		]).pipe(cleanCSS()).pipe(rename({suffix: '.min', prefix : ''})).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);