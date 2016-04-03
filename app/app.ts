import {Component, Injectable} from 'angular2/core';
import * as _ from 'lodash';
 
@Component({ 
    selector: 'my-app',
    template: '<div><h1>hello app!</h1><h3>{{stam}}</h3><app-checkbox on="false"></app-checkbox></div>',
})
@Injectable()
export class App {
    public stam: string;
    constructor() {
    }
} 
