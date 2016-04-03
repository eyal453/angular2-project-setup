var SYSTEM_CONFIG = 
{
    baseURL: '.',
    defaultJSExtensions: true,
    packages: {
        app: {
            format: 'register',
            main: 'bootstrap.js'
        }
    },
    paths: {
        'wijmo/*': 'node_modules/wijmo/scripts/vendor/*.min.js'
    },
    map: {
        'wijmo/wijmo.angular2.all': 'wijmo/wijmo.angular2',
        'angular2': 'node_modules/angular2',
        'lodash': 'node_modules/lodash/lodash.js',
        'rxjs': 'node_modules/rxjs'
    },
    meta: {
        'wijmo/wijmo.angular2.all': {
            deps: [
                'wijmo/wijmo',
                'wijmo/wijmo.input',
                'wijmo/wijmo.grid',
                'wijmo/wijmo.chart',
                'wijmo/wijmo.gauge'
            ]
        }
    }
};