import {VInternalRawPipe} from "./pipes/v-internal-raw-pipe";
import {VInternalJsonPipe} from "./pipes/v-internal-json-pipe";
import {VInternalAntiXssPipe} from "./pipes/v-internal-anti-xss-pipe";
import {VInternalTemplatePipe} from "./pipes/v-internal-template-pipe";
import {VInternalBase64EncodePipe} from "./pipes/v-internal-base64-encode-pipe";
import {VInternalBase64DecodePipe} from "./pipes/v-internal-base64-decode-pipe";

export class VInternalValueTransformer {

    private readonly _pipeDelimiter = '|';

    private readonly _pipes: VInternalTemplatePipe[] = [
        new VInternalAntiXssPipe(),
        new VInternalRawPipe(),
        new VInternalJsonPipe(),
        new VInternalBase64EncodePipe(),
        new VInternalBase64DecodePipe()
    ];

    constructor() {
        // util class
    }

    transform(value: string, templateRef: string): string {
        return this._pipes
            .reduce((result, pipe) => {
                const pipeName = pipe.name();
                const isTransformationNeeded = pipe.accept((templateRef) => {
                    return templateRef.indexOf(`${this._pipeDelimiter} ${pipeName}`) >= 0
                        || templateRef.indexOf(`${this._pipeDelimiter}${pipeName}`) >= 0;
                }, templateRef)

                return isTransformationNeeded
                    ? pipe.transform(result)
                    : result
            }, value);
    }

    getPipes(): VInternalTemplatePipe[] {
        return this._pipes;
    }
}