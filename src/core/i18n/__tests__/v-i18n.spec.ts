import {VI18n} from "../v-i18n";
import {VI18nLanguageSet} from "../../application/v-i18n-language-set";

describe('VI18n', () => {

    let service: VI18n;

    beforeEach(() => service = new VI18n());

    it('should return original key when active set not found', () => {
        const result = service.findTranslation('key');
        expect(result).toEqual('key');
    });

    it('should return original key when key is not in set', () => {
        const set: VI18nLanguageSet = {
            name: 'setName',
            translations: {}
        };
        service.setFindActiveSet(() => set);
        const result = service.findTranslation('key');
        expect(result).toEqual('key');
    });

    it('should return value when key has percent signs and key is in set', () => {
        const set: VI18nLanguageSet = {
            name: 'setName',
            translations: {
                'key': 'value'
            }
        };
        service.setFindActiveSet(() => set);
        const result = service.findTranslation('%key%');
        expect(result).toEqual('value');
    });

    it('should return value when key has no percent signs and key is in set', () => {
        const set: VI18nLanguageSet = {
            name: 'setName',
            translations: {
                'key': 'value'
            }
        };
        service.setFindActiveSet(() => set);
        const result = service.findTranslation('key');
        expect(result).toEqual('value');
    });
});