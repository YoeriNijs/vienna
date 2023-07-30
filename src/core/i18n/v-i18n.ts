import {VInjectable} from "../injector/v-injectable-decorator";
import {VI18nFindLanguageSet} from "../application/v-i18n-find-language-set";
import {replaceAll} from "../util/v-internal-regex-util";

@VInjectable({singleton: true})
export class VI18n {
    private _findActiveSet: VI18nFindLanguageSet;

    constructor() {
        // Util class
    }

    register(findActiveSet: VI18nFindLanguageSet): void {
        this._findActiveSet = findActiveSet;
    }

    findTranslation(key: string): string {
        const activeSet = this._findActiveSet();
        if (!activeSet) {
            return key;
        }

        key = replaceAll(key, '%', '');
        const translation = activeSet.translations[key];
        return translation ? translation : key;
    }


}