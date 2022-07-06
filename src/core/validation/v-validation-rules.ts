import {VValidationFunction} from "./v-validation-function";
import {VInternalValidationError} from "./v-internal-validation-error";

export class VNoBlankValidator implements VValidationFunction {
    validate(value: any): VInternalValidationError[] {
        if (!value || value.length < 1) {
            return [{ cause: 'blank', message: `Value '${value}' is blank!` }];
        } else {
            return [];
        }
    }
}
export const vNoBlankValidator = () => new VNoBlankValidator();

export class VStringValidator implements VValidationFunction {
    validate(value: any): VInternalValidationError[] {
        if (typeof value !== 'string') {
            return [{ cause: 'type error', message: `Value '${value}' is no string!` }];
        } else {
            return [];
        }
    }
}
export const vStringValidator = () => new VStringValidator();

export class VLengthValidator implements VValidationFunction {

    constructor(private _requiredLength: number) {}

    validate(value: any): VInternalValidationError[] {
        if (typeof value !== 'string') {
            return [{ cause: 'type error', message: `Value '${value}' is no string!` }];
        }

        if (value.length === this._requiredLength) {
            return [];
        }

        return [{ cause: 'length error', message: `Value '${value}' length is not ${this._requiredLength}` }];
    }
}
export const vLengthValidator = (requiredLength: number) => new VLengthValidator(requiredLength);

export class VNumberValidator implements VValidationFunction {
    validate(value: any): VInternalValidationError[] {
        if (typeof value !== 'number' || `${Number(value)}` === 'NaN') {
            return [{ cause: 'type error', message: `Value '${value}' is no number!` }];
        } else {
            return [];
        }
    }
}
export const vNumberValidator = () => new VNumberValidator();