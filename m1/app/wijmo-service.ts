import * as __dummy from 'wijmo/wijmo.angular2.all';
__dummy;

export class WijmoService{
    public getSomething(){
        return wijmo.Globalize.formatNumber(123,'n2');
    }
}