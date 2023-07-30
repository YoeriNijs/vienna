import {DUTCH_LANG} from "./nl";
import {ENGLISH_LANG} from "./en";
import {VI18nLanguageSet} from "../../src";

export const determineLanguageSet = (): VI18nLanguageSet => {
    if (window.location.href.endsWith('?lang=nl')) {
        return DUTCH_LANG;
    } else {
        return ENGLISH_LANG;
    }
}