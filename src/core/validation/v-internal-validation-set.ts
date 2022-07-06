import {VValidationFunction} from "./v-validation-function";

export interface VInternalValidationSet {
    fields: string[];
    functions: VValidationFunction[];
}