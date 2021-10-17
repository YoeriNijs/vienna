import {VInternalTemplate} from "../v-internal-template";

describe('VInternalTemplate', () => {
    it('should create with template', () => {
        const result = new VInternalTemplate('template');
        expect(result.get()).toEqual('template');
    });

    it.each([undefined, null, ''])('should create when template is %s', (template) => {
        const result = new VInternalTemplate(template);
        expect(result.get()).toEqual('');
    });
});
