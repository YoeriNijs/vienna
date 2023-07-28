import {VInternalRawPipe} from "./pipes/v-internal-raw-pipe";
import {VInternalJsonPipe} from "./pipes/v-internal-json-pipe";
import {VInternalAntiXssPipe} from "./pipes/v-internal-anti-xss-pipe";
import {VInternalTemplatePipe} from "./pipes/v-internal-template-pipe";
import {VInternalBase64EncodePipe} from "./pipes/v-internal-base64-encode-pipe";
import {VInternalBase64DecodePipe} from "./pipes/v-internal-base64-decode-pipe";
import {VInjector} from "../injector/v-injector";
import {VInternalCustomPipes} from "./pipes/v-internal-custom-pipes";
import {replaceAll} from "../util/v-internal-regex-util";

import {filterXSS} from "xss";
import {union} from 'pincet';

export class VInternalValueTransformer {

    private readonly _pipeDelimiter = '|';

    private readonly _internalPipes: VInternalTemplatePipe[] = [
        new VInternalAntiXssPipe(),
        new VInternalRawPipe(),
        new VInternalJsonPipe(),
        new VInternalBase64EncodePipe(),
        new VInternalBase64DecodePipe()
    ];

    constructor() {
        // util class
    }

    getInternalPipes(): VInternalTemplatePipe[] {
        return this._internalPipes;
    }

    transform(value: string, templateRef: string): string {
        const allPipes = this.getAllPipes();
        const templateRefSegments = this.createTemplateRefSegments(templateRef);
        const isPipeNameInSegments = this.isPipeNameInSegments(templateRefSegments, allPipes);

        return isPipeNameInSegments
            ? this.executePipes(templateRefSegments, allPipes, templateRef, value)
            : filterXSS(value);
    }

    private getAllPipes() {
        const customPipes: VInternalTemplatePipe[] = VInjector
            .resolve<VInternalCustomPipes>(VInternalCustomPipes)
            .toTemplatePipes();

        return union<VInternalTemplatePipe>(this._internalPipes, customPipes)
            .filter(p => p.name);
    }

    private executePipes(templateRefSegments: string[], allPipes: VInternalTemplatePipe[], templateRef: string, value: string) {
        return templateRefSegments
            .reduce((v, s) => {
                return allPipes
                    .filter(p => p.accept(s, p.name(), templateRef))
                    .reduce((v, p) => s === p.name() ? p.transform(v) : v, v);
            }, value);
    }

    private isPipeNameInSegments(templateRefSegments: string[], allPipes: VInternalTemplatePipe[]) {
        return templateRefSegments
            .some(segment => allPipes
                .some(p => p.name() === segment));
    }

    private createTemplateRefSegments(templateRef: string) {
        return templateRef
            .split(this._pipeDelimiter)
            .map(segment => replaceAll(segment, '{', ''))
            .map(segment => replaceAll(segment, '}', ''))
            .map(segment => segment.trim());
    }
}