import {VInternalCheckIf} from "./v-internal-check-if";
import {VInternalCheck} from "./v-internal-check";

export class VInternalCheckFactory {
    private readonly _implementation: VInternalCheck;

    constructor(element: Element) {
        const implementations: VInternalCheck[] = [
            new VInternalCheckIf()
        ];
        this._implementation = implementations.find(i => i.accept(element));
    }

    transform(runnable: (transformer: VInternalCheck) => any): Document {
        return runnable(this._implementation);
    }
}