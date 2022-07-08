import {VInjectable} from "../injector/v-injectable-decorator";
import {VInternalValidationSet} from "./v-internal-validation-set";
import {VInternalValidationError} from "./v-internal-validation-error";
import {getNestedPropertyByStringPath} from "../util/v-internal-object-util";

@VInjectable()
export class VValidator {

    validate(obj: any, validations: VInternalValidationSet[]): VValidationResult {
        const validationErrors: VInternalValidationError[] = validations
            .map(validation => this.executeValidationRule(obj, validation))
            .reduce((prev, curr) => prev.concat(curr), [])
            .reduce((prev, curr) => prev.concat(curr), []);

        return new VValidationResult(validationErrors);
    }

    private executeValidationRule(obj: any, validation: VInternalValidationSet): VInternalValidationError[] {
        return validation.fields.reduce((errors, field) => {
            const value = getNestedPropertyByStringPath(obj, field);
            if (!value || value && typeof value !== 'object') {
                const newErrors = validation.functions.map((fn) => fn.validate(value));
                return errors.concat(newErrors);
            } else {
                return errors.concat([{ cause: 'missing', message: `Field ${field} is missing in object ${JSON.stringify(obj)}`}]);
            }
        }, []);
    }
}

class VValidationResult {

    constructor(private _errors: VInternalValidationError[]) {}

    isValid(): boolean {
        return this.errorSize() < 1;
    }

    errors(): VInternalValidationError[] {
        return this._errors;
    }

    errorSize(): number {
        return this._errors.length;
    }

}