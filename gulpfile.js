var gulp = require('gulp'),
    _ = require('lodash'),
    karmaServer = require('karma').Server,
    karmaRunner = require('karma').runner,
    less = require('gulp-less'),
    ts = require('gulp-typescript'),
    merge2 = require('merge2'),
    runSequence = require('run-sequence'),
    util = require('gulp-util'),
    gp = require('gulp-protractor'),
    http = require('http'),
    express = require('express')
    ;

var runningE2e2 = 0;
var server = http.createServer(express().use(express.static(__dirname + '/')));

var modules = {
    common: {
        path: 'common',
        test: false
    },
    m1: {
        path: 'm1',
        test: true,
        deps: ['common']
    },
    m2: {
        path: 'm2',
        test: true,
        deps: ['common']
    }
};

function tsc(path, done) {
    util.log('-- ' + path + ':', util.colors.cyan('Transpiling'));
    var tsProj = ts.createProject(path + '/tsconfig.json',
        {
            typescript: require('typescript')
        }
    );
    var tsRes = tsProj.src()
        .pipe(ts(tsProj));

    return tsRes.js.pipe(gulp.dest(path));
}

function css(path, done) {
    util.log('-- ' + path + ':', util.colors.cyan('Compiling LESS'));
    return gulp.src(path + '/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(path));
}

function test(path, done, singleRun) {
    util.log('-- ' + path + ':', util.colors.cyan('Testing'));
    new karmaServer({
        configFile: __dirname + '/' + path + '/karma.conf.js',
        singleRun: singleRun
    }, function(exitCode) {
        if (exitCode == 0) {
            done();
            return;
        }
        util.log(util.colors.red('Tests failed for', path));
        process.exit(exitCode);
    }).start();
}

function e2e(path, done, index) {
    function closeServer() {
        if (runningE2e2 > 0) return;
        console.log("CLOSING SERVER");
        server.close();
    }

    index = index || 0;
    runningE2e2++;
    return gulp.src('./*.dummy')
        .pipe(gp.protractor({
            configFile: './' + path + '/protractor.config.js',
            baseUrl: 'http://localhost:' + (3000 + index) + '/' + path,
            beforeLaunch: function() {
            }
        })).on('error', function(err) {
            throw err;
        }).on('end', function() {
        });
}

var taskWorkers = {
    css: css,
    tsc: tsc,
    test: test,
    devtest: test,
    e2e: e2e
}

function getTaskName(type, path) {
    return path + ':' + type;
}

function generateTask(type, path, deps, params) {
    if (!taskWorkers[type]) return null;

    var taskName = getTaskName(type, path);
    gulp.task(taskName, deps || [], function(done) {
        return taskWorkers[type](path, done, params);
    });
    return taskName;
}

var tasks = _.map(modules, function(mod) {
    var buildTaskName = getTaskName('build', mod.path);
    var devTaskName = getTaskName('dev', mod.path);

    //css and ts tasks
    var cssTaskName = generateTask('css', mod.path);
    var tscTaskName = generateTask('tsc', mod.path);

    var tasks = [
        cssTaskName,
        tscTaskName
    ];

    //map dependencies
    var deps = (mod.deps || [])
        .map(function(d) { return getTaskName('build', d); })
        .concat(tasks);

    gulp.task(buildTaskName, deps.concat(tasks), function(done) {
        done();
    });

    //test and e2e tasks
    if (mod.test) {
        var singleTestTaskName = generateTask('test', mod.path, [buildTaskName], true);
        var testTaskName = generateTask('devtest', mod.path, [devTaskName]);
        var e2eTaskName = generateTask('e2e', mod.path);
    }

    //dev watch tasks
    gulp.task(devTaskName, [buildTaskName], function() {
        gulp.watch([mod.path + '/**/*.less'], function(ev) {
            gulp.start(cssTaskName);
        });
        gulp.watch([mod.path + '/**/*.ts'], function(ev) {
            gulp.start(tscTaskName);
        });
    });

    return {
        build: buildTaskName,
        test: singleTestTaskName,
        e2e: e2eTaskName
    };
});

gulp.task('build', tasks.map(function(t) { return t.build; }));

gulp.task('test', tasks
    .filter(function(t) { return !!t.test; })
    .map(function(t) { return t.test; })
);

gulp.task('webdriver-update', function(done) {
    return gp.webdriver_update(done);
});

gulp.task('start-server', function(done) {
    if (server.listening) return;
    return server.listen('3000', done);
});

gulp.task('stop-server', ['start-server'], function(done) {
    server.close(done);
});

gulp.task('e2e', ['build', 'start-server'].concat(tasks
    .filter(function(t) { return !!t.e2e; })
    .map(function(t) { return t.e2e; })
), function(done) {
    gulp.start('stop-server')
});

gulp.task('e2e', ['build', 'webdriver-update'], function(done) {
    var e2eTasks = tasks
        .filter(function(t) { return !!t.e2e; })
        .map(function(t) { return t.e2e; })
        .concat(done);
    return runSequence.apply(null, e2eTasks);
});

gulp.task('test_e2e', ['test', 'e2e']);

gulp.task('e', ['start-server'], function() {
    return gulp.start('stop-server');
})


