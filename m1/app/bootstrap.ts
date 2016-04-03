import {provide, enableProdMode, Injectable} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {bootstrap} from "angular2/platform/browser";
import {App} from './app';

export var APP_BINDINGS = [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
];

bootstrap(App,APP_BINDINGS);
