import {Component, Input} from 'angular2/core';
import {PathService} from '../../../common/core/services/path';

var filePath = '/common/ui/checkbox/';

@Component({ 
    templateUrl: PathService.getRelativePath(filePath) + 'checkbox.html',
    styleUrls: [PathService.getRelativePath(filePath) + 'checkbox.css'],
    selector: 'app-checkbox',
    host: {
        '(click)': 'onClick()'
    }
})
export class AppCheckbox {
    @Input() on: boolean;

    ngOnInit() {
        this.on = !!this.on;
    }

    onClick() {
        this.on = !this.on;
    }
}