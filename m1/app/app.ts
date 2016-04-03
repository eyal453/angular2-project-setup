import {Component, Injectable} from 'angular2/core';
import * as _ from 'lodash';
import {WijmoService} from './wijmo-service';
import {AppCheckbox} from '../../common/ui/checkbox/checkbox'
import {PathService} from '../../common/core/services/path'
 
@Component({ 
    selector: 'my-app',
    template: '<div><h1>hello app!</h1><h3>{{stam}}</h3><app-checkbox on="false"></app-checkbox></div>',
    providers: [WijmoService],
    directives: [AppCheckbox]
})
@Injectable()
export class App {
    public stam: string;
    constructor(wsvc: WijmoService) {
        PathService.setPath();
        this.stam = wsvc.getSomething(); //_.repeat('meow',3);
    }
} 
