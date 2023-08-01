import {VPipe, VPipeTransform} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */

@VPipe({
    name: 'translate'
})
export class TranslatePipe implements VPipeTransform {
    transform(value: string): string {
        if (value.toLowerCase() === 'hello, world!') {
            return 'Hallo, wereld!';
        } else {
            return value;
        }
    }

}