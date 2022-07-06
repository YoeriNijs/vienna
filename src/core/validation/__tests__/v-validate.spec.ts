import {VValidator} from "../v-validator";
import {vLengthValidator, vNoBlankValidator, vNumberValidator, vStringValidator} from "../v-validation-rules";

describe('VValidate', () => {

    const validator = new VValidator();

    it('should validate multiple fields and everything is valid', () => {
        const person = { name: 'Bert', age: 30 };
        const result = validator.validate(person, [
            { fields: ['name', 'age'], functions: [vNoBlankValidator()] },
            { fields: ['name'], functions: [vStringValidator(), vLengthValidator(4)] },
            { fields: ['age'], functions: [vNumberValidator()] }
        ]);
        expect(result.isValid()).toBe(true);
    });

    it('should validate multiple fields and one is invalid', () => {
        const person = { name: 'Bert', age: 30 };
        const result = validator.validate(person, [
            { fields: ['name'], functions: [vNoBlankValidator(), vNumberValidator()] },
            { fields: ['age'], functions: [vNoBlankValidator(), vNumberValidator()] }
        ]);
        expect(result.errorSize()).toEqual(1);
        expect(result.isValid()).toBe(false);
        expect(result.errors()[0].cause).toEqual('type error');
    });

    describe('Rules', () => {
        it.each([null, undefined, 1, true, {}])('should provide an error when value is \'%s\'', v => {
            const result = validator.validate(
                { name: v },
                [ { fields: ['name'], functions: [vStringValidator()] } ]
            );
            expect(result.errorSize()).toEqual(1);
            expect(result.isValid()).toBe(false);
            expect(result.errors()[0].cause).toEqual('type error');
        });

        it.each([null, '', undefined])('should provide an error when value is \'%s\'', v => {
            const result = validator.validate(
                { name: v },
                [ { fields: ['name'], functions: [vNoBlankValidator()] } ]
            );
            expect(result.errorSize()).toEqual(1);
            expect(result.isValid()).toBe(false);
            expect(result.errors()[0].cause).toEqual('blank');
        });

        it.each(['1', true, undefined, null, {}])('should provide an error when value is \'%s\'', v => {
            const result = validator.validate(
                { age: v },
                [ { fields: ['age'], functions: [vNumberValidator()] } ]
            );
            expect(result.errorSize()).toEqual(1);
            expect(result.isValid()).toBe(false);
            expect(result.errors()[0].cause).toEqual('type error');
        });

        it('should not provide an error when length is valid', () => {
            const result = validator.validate(
                { name: 'Ernie' },
                [ { fields: ['name'], functions: [vLengthValidator(5)] } ]
            );
            expect(result.isValid()).toBe(true);
            expect(result.errors()).toHaveLength(0);
            expect(result.errorSize()).toBe(0);
        });

        it('should provide an error when length is invalid', () => {
            const result = validator.validate(
                { name: 'Ernie' },
                [ { fields: ['name'], functions: [vLengthValidator(4)] } ]
            );
            expect(result.isValid()).toBe(false);
            expect(result.errorSize()).toBe(1);
            expect(result.errors()[0].cause).toEqual('length error');
        });
    });
});