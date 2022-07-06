import {VInjectable} from "../injector/v-injectable-decorator";
import {VInternalValidationSet} from "./v-internal-validation-set";
import {VInternalValidationError} from "./v-internal-validation-error";

@VInjectable()
export class VValidate {

    validate(obj: any, validations: VInternalValidationSet[]): VValidationResult {
        const validationErrors = validations
            .map(validation => this.executeValidationRule(obj, validation))
            .reduce((prev, curr) => prev.concat(curr), [])
            .reduce((prev, curr) => prev.concat(curr), []);

        return new VValidationResult(validationErrors);
    }

    private executeValidationRule(obj: any, validation: VInternalValidationSet): VInternalValidationError[] {
        return Object.keys(obj)
            .filter((actualField) => validation.fields.some((expectedField) => expectedField === actualField))
            .reduce((existingValidationErrors, actualField) => {
                const newValidationErrors = validation.functions.map((fn) => fn.validate(obj[actualField]));
                return existingValidationErrors.concat(newValidationErrors);
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