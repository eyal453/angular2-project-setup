function getSystemJsConfig(baseUrl, rootPath) {
    return {
        baseURL: baseUrl,
        defaultJSExtensions: true,
        packages: {
            app: {
                format: 'register',
                main: 'bootstrap.js'
            }
        },
        paths: {
            'wijmo/*': rootPath + 'node_modules/wijmo/scripts/vendor/*.min.js'
        },
        map: {
            'wijmo/wijmo.angular2.all': 'wijmo/wijmo.angular2',
            'angular2': rootPath + 'node_modules/angular2',
            'lodash': rootPath + 'node_modules/lodash/lodash.js',
            'rxjs': rootPath + 'node_modules/rxjs'
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
}