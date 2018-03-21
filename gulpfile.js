var gulp 				= require('gulp'),
		realFavicon = require('gulp-real-favicon'), //generate, add favicons
		fs 					= require('fs'),
		browsersync = require('browser-sync'),
		pug 				= require('gulp-pug'),
		plumber 		= require('gulp-plumber'),
		sass 				= require('gulp-sass'),
		prefix 			= require('gulp-autoprefixer'),
		concat 			= require('gulp-concat'),
		browserSync = require('browser-sync').create(),
		rimraf 			= require('rimraf'),
		useref 			= require('gulp-useref'),
		cssmin 			= require('gulp-clean-css'),
		uglify 			= require('gulp-uglify'),
		gulpif 			= require('gulp-if'),
		imagemin 		= require('gulp-imagemin');

var paths = {
			blocks: 'blocks/',
			dev: 'app/',
			output: 'build/'
		};

//generation favicons
gulp.task('gen-fav', function(done) {
	realFavicon.generateFavicon({
		masterPicture: 'app/img/favicon/source_favicon/fav.png', //source favicon
		dest: 'app/img/favicon', //output favicons
		iconsPath: 'img/favicon', //path in html
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff', //background color for ios
				margin: '18%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#603cba', //background color for windows
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: true,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'shadow',
				themeColor: '#fff8f8', //background color for android(don`t use)
				manifest: {
					name: '', //name application
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#603cba' //color for safari
			}
		},
		settings: {
			compression: 1,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: false,
			usePathAsIs: false
		},
		markupFile: 'app/img/favicon/faviconData.json'
	}, function() {
		done();
	});
});

/*************
	Dev tasks
**************/

//pug compile
gulp.task('pug', function() {
	return gulp.src([paths.blocks + '*.pug', '!' + paths.blocks + 'template.pug' ])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(paths.dev))
		.pipe(browserSync.stream())
});

//sass compile
gulp.task('sass', function() {
	return gulp.src(paths.blocks + '*.sass')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
			browsers: ['last 15 versions'],
			cascade: true
		}))
		.pipe(gulp.dest(paths.dev + 'css/'))
		.pipe(browserSync.stream());
});

//js compile
gulp.task('scripts', function() {
	return gulp.src([
			paths.blocks + '**/*.js',
			'!' + paths.blocks + '_assets/**/*.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.dev + 'js/'))
		.pipe(browserSync.stream());
});

//watch
gulp.task('watch', function() {
	gulp.watch(paths.blocks + '**/*.pug', ['pug']);
	gulp.watch(paths.blocks + '**/*.sass', ['sass']);
	gulp.watch(paths.blocks + '**/*.js', ['scripts']);
});

// browser
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.dev
		},
		notify: false,
		// for demonstration
		// open: false, 
		// tunnel: true,
		// tunnel: "projectname" 
		//Demonstration page: http://projectname.localtunnel.me
	});
});

/*************
	Prod tasks
**************/

//clean
gulp.task('clean', function(cb) {
	rimraf(paths.output, cb);
});

//css + js
gulp.task('build', ['clean'], function () {
	return gulp.src(paths.dev + '*.html')
		.pipe( useref() )
		.pipe( gulpif('*.js', uglify()) )
		.pipe( gulpif('*.css', cssmin()) )
		.pipe( gulp.dest(paths.output) );
});

//copy images to outputDir
gulp.task('imgBuild', ['clean'], function() {
	return gulp.src(paths.dev + 'img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.output + 'img/'));
});

//copy fonts to outputDir
gulp.task('fontsBuild', ['clean'], function() {
	return gulp.src(paths.dev + '/fonts/*/*')
		.pipe(gulp.dest(paths.output + 'fonts/'));
});


//default
gulp.task('default', ['browser-sync', 'watch', 'pug', 'sass', 'scripts']);

//production
gulp.task('prod', ['build', 'imgBuild', 'fontsBuild']);