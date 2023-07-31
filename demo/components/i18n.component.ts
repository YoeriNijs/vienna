import {VComponent} from "../../src";
import {VI18n} from "../../src/core/i18n/v-i18n";

@VComponent({
    selector: 'i18n-component',
    styles: [`p { display: flex; flex-direction: column; margin-bottom: 10px; border: 1px solid black; }`],
    html: `
        <p>
            <span>{{ %test% }}</span>
            <a href="#/i18n?lang=en">English</a>
            <a href="#/i18n?lang=nl">Nederlands</a>
        </p>
        <p>
            <span>{{ translationFromComponent }}</span>
            <button @click="changeValue()">Change value with service</button>
        </p>
    `
})
export class I18nComponent {
    translationFromComponent = 'Original value';

    constructor(private _i18n: VI18n) {
    }

    changeValue(): void {
        this.translationFromComponent = this._i18n.findTranslation('anotherTest');
    }
}