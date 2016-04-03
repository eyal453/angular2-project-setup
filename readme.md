# Project Setup


## SystemJS and TypeScript

The main goal is to allow systemJS to import all 
javascript files and bootstrap our app without 
changing the config file when adding or removing 
files from our project. This also means minimizing the need to 
reference project files inside `index.html`. 

<a name='index-html'></a>
Our `index.html` will have a reference to the following files:
```javascript

//shims and polyfills
node_modules/es6-shim/es6-shim.min.js 
node_modules/systemjs/dist/system-polyfills.js 
node_modules/angular2/es6/dev/src/testing/shims_for_IE.js
node_modules/angular2/bundles/angular2-polyfills.js

//SystemJS script and config file
node_modules/systemjs/dist/system.src.js
./system.config.js
```


In order to do that in an Angular2/TypeScript project we first tell `tsc`
to compile using the `system` module mechanism instead of `commonjs`. 
This will convert any `import {Something} from 'some_module'` to a `System.register`
call which will be picked up and handled by SystemJS.

The next thing we need to do is define our app package inside SystemJS config file.
```
packages: {
    app: {
        format: 'register', 
        main: 'bootstrap.js'
    }
},
```
We tell SystemJS to use the `register` format to comply with 
our `tsconfig.json` module mechanism. We also point it to the file in 
charge of bootstrapping our angular app.

### Vendor Dependencies
SystemJS requires specific instructions regarding the location of
our vendor dependencies such as Angualr, rx, lodash, etc.
When SystemJS encounters an `import` statement it'll try to get it from the 
root path unless told otherwise. `import {X} from 'x'` will generate the 
following http call: `http://<path_and_port>/x.js`. We actually need SystemJS to call
`http://<path_and_port>/node_modules/x/x.js`. To do this we add a `map` definition
to `system.config.js`:

```
 map: {
    'angular2': 'node_modules/angular2',
    'lodash': 'node_modules/lodash/lodash.js',
    'rxjs': 'node_modules/rxjs'
},
```

This may seem redundant but we have to do this for every vendor dependency we add.

### Wijmo

Wijmo has a few files that need to be loaded. A main Angular2 file - `wijmo.angular2.min.js`
and its core library modules. The Angular2 file is compiled using `System.register`
and can be easily referenced into our project. However, Wijmo's core library modules aren't
and we need tell SystemJS to load them as globals. In our code we will reference
Wijmo's components using `import {something} from 'wijmo.angular2.all` or, in order
to access a global, `import * as __dummy from 'wijmo/wijmo.angular2.all'`. 
The latter is being called only to force SystemJS to load all of Wijmo's scripts.
We tell SystemJS that `wijmo.angular.all` depends on those other scripts by
adding a `meta` and `deps` definitions:
```
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
```

Any call to `wijmo/wijmo.angular.all` will generate calls to these scripts as well.
There's only one problem left. We need to tell SystemJS where to find all the actual
Wijmo folder. We also need to tell SystemJS that all the Wijmo files actually
end with `.min.js` and not just `.js`. We add it to the `map` and `path` deifintions:
```
map: {
    'wijmo/wijmo.angular2.all': 'wijmo/wijmo.angular2',
    ...
    ...
},
...
paths: {
    'wijmo/*': 'node_modules/wijmo/scripts/vendor/*.min.js'
},
```

This instruction will convert any call to `wijmo/wijmo.angular2.all` to 
`node_modules/wijmo/scripts/vendor/wijmo.angular2.min.js` and any call to 
`wijmo/wijmo.chart` to 
`node_modules/wijmo/scripts/vendor/wijmo.chart.min.js`.

### Typings
We have to tell `tsc` where to find all the definitions of 3rd party vendors
and our beloved Wijmo scripts. We do this using a `typings.json` file. It's 
important to note that we add every single Wijmo typings reference for now 
since their code doesn't reference the `d.ts` files properly. 

### Build and Run

Now that everything is set up we can run `tsc` and launch our app.
Everything should work.

## Testing with Karma

When setting up Karma for testing one would usually add all the sources needed
to the `files` definitions in the `karma.conf.js` file. We, however, would like
SystemJS to handle this for us so we can avoid modifying the configuration file
every time files are being added or removed. We tell karma to load the necessary 
shims and polyfills and the SystemJS script:
```
files: [
    'node_modules/es6-module-loader/dist/es6-module-loader.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/angular2/bundles/angular2-polyfills.js',
    ...
]
```

The next step is to tell Karma to serve all required app files and vendor dependencies.
We do that using the `pattern` syntax inside the `files` definition:
```
{ pattern: 'app/**/*.js', included: false, watched: true },
{ pattern: 'node_modules/angular2/**/*.js', included: false, watched: false },
{ pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
{ pattern: 'node_modules/wijmo/**/*.js', included: false, watched: false },
{ pattern: 'app/**/*_spec.js', included: false, watched: true },
{ pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false }, // PhantomJS2 (and possibly others) might require it
```
Notice the `included:false` flag. This flag tells Karma to server those files
on the http server but not to include them with `<script>` tags.

The last two files we'll be telling Karma to load are the `system.config.js` and 
a file called `test-main.js`.

### test-main.js

This file overrides the `karma.loaded` function in order to modify the 
way karma starts. It loads all of Angular2 test dependencies and after that's done,
it bootstraps our testing environment.

There are two things we need to know here:
1. Each spec file will have a `_spec` postfix.
2. Each spec file will have a single entry point through a `main` function.
This function will be called by the `test-main.js` file.

### npm
We need add the appropriate instructions to our `package.json` file. 
First, we tell it to run `tsc` and then we run `karma start --single-run`. 
The `single-run` flag tells it to override the `singleRun:false` in the configuration file
and exit after a single run with the proper exit code.

## Protractor and E2E

We add an `e2e` folder to our project. This folder will contain all e2e tests.
Protractor works against a webdirver browser driver and webdriver works against a selenium server. 
See `package.json` to see all the dependencies it requires. 

Before we can run tests we need to make sure we have a running app to test against.
Since our app is made of static files only this is fairly simple. We use node and express
to spin up a local http server and serve our files. Our `protractor.config.js` 
will start with the following lines:
```
var express = require('express');
var app = express();
var port = '3000';
var server;
```
Then, we use two callback definitions - `beforeLaunch` and `afterLaunch`.
`beforeLaunch` is called after the configs are read but before any environment
setup. `afterLaunch` is called after all tests are done and the webdriver instance
has been shut down.
```
beforeLaunch: function() {
    app.use(express.static('./'));
    server = app.listen(port);
},
afterLaunch: function() {
    server.close();
}
```

The rest of the `protractor.config.js` definitions are pretty straight forward:
```
framework: 'jasmine2', //for angular2
directConnect: true, //to connect directly to the web driver
baseUrl: 'http://localhost:'+port, //url of our app as defined in the beforeLaunch callback
specs: ['./e2e/*_spec.js'], //our spec files
multiCapabilities: [ // we're launching chrome
    {
        browserName: 'chrome'
    }
],
useAllAngular2AppRoots: true, //need to wait for angular to finish loading
```

## TypeScript configuration
We write our e2e tests in TypeScript. The problem here is our environment has changed.
We are now running in the server since protractor is a node app and all of our specs
are loaded as modules in node using `require` and not with SystemJS. We need
to tell `tsc` to compile our `e2e` folder using `commonjs` instead of `system`. 
We do that by excluding `e2e` from our main `tsconfig.json` and by adding another
`tsconfig.json` inside the `e2e` folder. This `tsconfig.json` file specifies
`"module": "commonjs"` in its `compilerOptions`. We will tell `npm` to run `tsc`
on this folder before executing the tests. In order for it to work we must add
all the typings from the folder above. So we add a `_typings.d.ts` file to the root.
This file contains a single line, `/// <reference path="../typings/browser.d.ts" />`,
referencing our typings definitions.

### npm
We add the appropriate instructions to our `package.json` file. It'll first run
`tsc -p e2e`. Then `webdriver-manager update` to update it under the `npm` context.
And finally call `protractor protractor.config.js`.





 
"# angular2-multimodule" 
