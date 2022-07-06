import {VInternalValidationError} from "./v-internal-validation-error";

export interface VValidationFunction {
    validate: (value: any) => VInternalValidationError[];
}