var pkg = require('./package.json');
var gulp = require('gulp');
var eol = require('os').EOL;
var nodeunit = require('gulp-nodeunit');
var plugins = require('gulp-load-plugins')();
var shell = require('gulp-shell');

require('gulp-load')(gulp);

// Patternlab-php: disabled clean, banner and patternlab-node tasks
// var banner = [ '/** ',
//   ' * <%= pkg.name %> - v<%= pkg.version %> - <%= today %>',
//   ' * ', ' * ',
//   ' * <%= pkg.author %>, and the web community.',
//   ' * Licensed under the <%= pkg.license %> license.',
//   ' * ',
//   ' * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice.',
//   ' * ', ' * ', ' **/'].join(eol);

// gulp.loadTasks(__dirname+'/builder/gulp-patternlab.js');

//gulp.task('clean', function(){
//  return gulp.src('./public/patterns/*', {read:false})
//    .pipe(plugins.rimraf());
//});
//gulp.task('banner', function(){
//  return gulp.src(['./builder/patternlab.js', './builder/object_factory.js'])
//    .pipe(plugins.stripBanner())
//    .pipe(plugins.header( banner, {
//      pkg : pkg,
//      today : new Date().getFullYear() }
//    ))
//    .pipe(gulp.dest('./builder'));
//});

/**
 * Patternlab-php: Execute patternlab-php build
 */
gulp.task('patternlab', ['patternlab:pre'], shell.task([
  'php core/console --generate'
]));

gulp.task('patternlab:export', ['patternlab'], shell.task([
  'php core/console --export'
]));

gulp.task('patternlab:exportdata', ['patternlab:export'], function () {
  return gulp.src('./public/styleguide/data/patternlab-data.js')
    .pipe(gulp.dest('./export/js'));
});

/**
 * Generate SASS and run patternlab
 */
gulp.task('patternlab:sass',['sass'], shell.task([
  'php core/console --generate'
]));

/**
 * Generate JS and run patternlab
 */
//gulp.task('patternlab:js',['js', 'js:prototype'], shell.task([
gulp.task('patternlab:js',['js'], shell.task([
  'php core/console --generate'
]));

gulp.task('patternlab:only', shell.task([
  'php core/console --generate'
]));

gulp.task('cp:font', function(){
	return gulp.src([
    './bower_components/fontawesome/fonts/fontawesome-webfont.*',
    './assets/fonts/*'
  ])
	.pipe(gulp.dest('./source/assets/fonts'));
});

gulp.task('cp:flash', function () {
	return gulp
		.src(['./assets/swf/*.swf','./assets/swf/*.xml'])
		.pipe(gulp.dest('./source/assets/swf/'));
});



/**
 * Copy all assets from the patternlab ./source to ./public
 */
gulp.task('pl:allassets', function () {
  return gulp
    .src('./source/assets/**/*')
    .pipe(gulp.dest('./public/assets/'));
});

gulp.task('connect', function(){
  return plugins.connect.server({
    root: './public',
    host: 'localhost',
    port: 9001,
    livereload: true
  });
});
gulp.task('nodeunit', function(){
  return gulp.src('./test/**/*_tests.js')
    .pipe(nodeunit());
});

gulp.task('sass:vendors', function() {
  return gulp.src([
      './assets/css/vendors/bootstrap/bootstrap.css',
      // './bower_components/bootstrap-touch-carousel/dist/css/bootstrap-touch-carousel.css',
      // './bower_components/fontawesome/css/font-awesome.css',
      // './bower_components/animate.css/animate.css',
      // './bower_components/owlcarousel/dist/assets/owl.carousel.css',
      // './bower_components/nouislider/src/jquery.nouislider.css',
      // './bower_components/nouislider/src/jquery.nouislider.pips.css'
      './bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
    ])
    .pipe(plugins.rename({ prefix: '_', extname: '.scss' }))
    .pipe(gulp.dest('./assets/css/vendors'));
});

gulp.task('sass', ['sass:vendors'], function() {
	return gulp.src("./assets/css/*.scss")
		.pipe(plugins.plumber())
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer( 'last 2 versions', '> 2%', 'ie 9', 'ie 8', 'ie 7', {cascade: false}))
    .pipe(plugins.pixrem('16px'))
    .pipe(gulp.dest("./source/assets/css"))

    /**
     * create minified version
     */
    .pipe(plugins.size())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.minifyCss({
      noAdvanced: true,
      compatibility: "ie8"
    }))
    .pipe(gulp.dest("./source/assets/css"))
    .pipe(plugins.size())
    // Patternlab-php: Disabled livereload here.
    // .pipe(plugins.livereload())
  ;
});

gulp.task('w:sass', function(){
	return plugins.watch([
		'./assets/css/**/*.scss',
		'!./assets/css/vendors/**/*.scss'
	], function(files){
		// Patternlab: pl:sass instead os sass
    // return gulp.start('sass');
    return gulp.start('patternlab:sass');
	});
});
gulp.task('w:js', function(){
  return plugins.watch([
    './assets/js/inits/*.js',
    // './assets/js/prototype/*.js'
  ], function(files){
    // Patternlab: pl:sass instead os sass
    // return gulp.start('sass');
    return gulp.start('patternlab:js');
  });
});
gulp.task('w:patterns', function(){
	return plugins.watch([
		'./source/_patterns/**/*.twig',
		'./source/_patterns/**/*.json',
		'./source/_data/*.json'	],
		function(){
			return gulp.start('patternlab:only');
		});
});

gulp.task('js', function () {
	return gulp.src([
      'bower_components/conditionizr/dist/conditionizr.js',
      'bower_components/conditionizr/detects/*.js',
      'bower_components/jquery/jquery.js',
      'bower_components/modernizr/modernizr.js',
      'bower_components/parsley.js/dist/parsley.js',
      'bower_components/picturefill/dist/picturefill.js',
      //'bower_components/html5shiv/dist/html5shiv.js',
      'bower_components/respond/dest/respond.min.js',
      'bower_components/selectivizr/selectivizr.js',
      //'bower_components/webfontloader/index.js',
      //'bower_components/noty/js/noty/packaged/jquery.noty.packaged.js',
      //'bower_components/bootstrap/js/carousel.js',
      'bower_components/bootstrap/js/tab.js',
      'bower_components/bootstrap/js/tooltip.js',
      //'bower_components/bootstrap-touch-carousel/dist/js/bootstrap-touch-carousel.js',
      'bower_components/bootstrap/js/collapse.js',
      //'bower_components/owlcarousel/dist/owl.carousel.js',
      //'bower_components/bootstrap-tabcollapse/bootstrap-tabcollapse.js',
      //'bower_components/swfobject/swfobject/swfobject.js',
      'bower_components/nouislider/distribute/jquery.nouislider.all.js',
      'bower_components/moment/moment.js',
      'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
      './assets/js/inits/*.js'
    ])
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.size())
    .pipe(gulp.dest('./source/assets/js/'))

    // minified version
    .pipe(plugins.size())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.size())
    .pipe(gulp.dest('./source/assets/js'));
});

//gulp.task('js:prototype', function () {
//	return gulp.src([ './assets/js/prototype/*.js' ])
//    .pipe(plugins.concat('prototype.js'))
//    .pipe(plugins.size())
//    .pipe(gulp.dest('./source/assets/js/'))
//  ;
//});

gulp.task('default', ['lab', 'watch', 'connect']);

gulp.task('watch', ['w:sass', 'w:patterns', "w:js"]);
//gulp.task('assets', ['cp:font', 'cp:flash', 'cp:html5animation', 'sass', 'js', 'js:prototype', 'favicons']);
// gulp.task('assets', ['sass', 'js', 'js:prototype']);
gulp.task('assets', ['cp:font', 'sass', 'js']);
// Patternlab-php: disabled patternlab-node tasks
// gulp.task('prelab', ['banner', 'assets']);
gulp.task('patternlab:pre', ['assets']);
gulp.task('lab', ['patternlab', 'assets', 'images']);
gulp.task('patterns', ['patternlab']);
// Patternlab-php: disabled patternlab-node tasks
// gulp.task('patterns', ['patternlab:only_patterns']);
gulp.task('serve', ['lab', 'connect']);
gulp.task('travis', ['lab', 'nodeunit']);

gulp.task('version', ['patternlab:version']);
gulp.task('help', ['patternlab:help']);

//gulp.task('images', ['images:resample', 'images:thumbnails', 'svg', 'cp:images']);
gulp.task('images', ['svg', 'cp:images']);
gulp.task('svg', ['svg:min', 'svg:png']);

gulp.task('cp:images', function () {
  return gulp.src('./assets/images/copy-this/*.*')
    .pipe(gulp.dest('./source/assets/images'));
});

gulp.task('images:convert', function () {
	return gulp.src('./assets/images/example*.png')
		.pipe(plugins.gm(function (gmfile) {
			return gmfile.setFormat('jpg');
		}))
		.pipe(gulp.dest('./assets/images/'))
	;
});

gulp.task('images:resample', ['images:convert'], function () {
	var images = [
		'./assets/images/example*.jpg',
		'./assets/images/sample*.jpg'
	];
	var out = './source/assets/images';
	var resize = function(size) {
		return plugins.gm(function (gmfile) {
			return gmfile.resize(size);
		});
	};

	return gulp.src(images)
		// extra large
		.pipe(resize(1200))
		.pipe(plugins.extReplace('.xl.jpg'))
		.pipe(gulp.dest(out))

		// large
		.pipe(resize(800))
		.pipe(plugins.extReplace('.l.jpg', '.xl.jpg'))
		.pipe(gulp.dest(out))

		// medium
		.pipe(resize(500))
		.pipe(plugins.extReplace('.m.jpg', '.l.jpg'))
		.pipe(gulp.dest(out))

		// small
		.pipe(resize(300))
		.pipe(plugins.extReplace('.s.jpg', '.m.jpg'))
		.pipe(gulp.dest(out))

		// 3:2 ratio
		.pipe(plugins.gm(function (gmfile) {
			return gmfile
				.resize('300', '200', '^')
				.gravity('Center')
				.crop('300', '200')
			;
		}))

		.pipe(plugins.extReplace('.32.jpg', '.s.jpg'))
		.pipe(gulp.dest(out))
	;
});

gulp.task('images:thumbnails', function () {
    return gulp.src([
      './assets/images/example*.jpg',
      './assets/images/example*.gif',
      './assets/images/example*.png',
      './assets/images/sample*.jpg',
      './assets/images/sample*.gif',
      './assets/images/sample*.png'
    ])
    .pipe(plugins.gm(function (gmfile) {
      return gmfile.resize(100,100);
    }))
    .pipe(plugins.rename({suffix: '.thumb'})) // Add suffix .thumb
    .pipe(gulp.dest('./source/assets/images'))
  ;
});

gulp.task('svg:png', function () {
	return gulp.src('./assets/images/*.svg')
    .pipe(plugins.svg2png(['4.0']))
    .pipe(gulp.dest('./source/assets/images'))
  ;
});

gulp.task('svg:min', function() {
  return gulp.src('./assets/images/*.svg')
    .pipe(plugins.svgmin())
		.pipe(gulp.dest('./source/assets/images'))
  ;
});


var favicons = require('favicons');
gulp.task('favicons', function () {
	favicons({
		source: './assets/images/favicon-src.png',
		dest: './source/assets/images/favicons',

		// Icon Types
		android: true,
		apple: true,
		coast: true,
		favicons: true,
		firefox: true,
		opengraph: true,
		windows: true,

		// Miscellaneous
		html: 'dist/favicons.html',
		background: '#ffffff',
		tileBlackWhite: false,
		manifest: null,
		trueColor: false,
		url: 'http://ifm.com',
		logging: false,
		callback: null
	});
});
