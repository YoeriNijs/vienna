import {VInternalCheckIf} from "./v-internal-check-if";
import {VInternalCheck} from "./v-internal-check";
import {getDefinedOrElse} from "../../../../util/v-internal-object-util";
import {VRenderError} from "../../../v-render-error";

export class VInternalCheckFactory {
    private readonly _implementation: VInternalCheck;

    constructor(element: Element) {
        const implementations: VInternalCheck[] = [
            new VInternalCheckIf()
        ];
        const implementation = implementations.find(i => i.accept(element));
        this._implementation = getDefinedOrElse(implementation, () => {
            throw new VRenderError('Invalid check element found: missing required attribute(s).');
        });
    }

    transform(runnable: (transformer: VInternalCheck) => any): Document {
        return runnable(this._implementation);
    }
}