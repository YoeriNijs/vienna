import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VAudit} from "../../../misc/audit/v-audit";
import {VTemplateRenderException} from "../../../template-engine/v-template-render-exception";

const V_SWITCH_TAG = 'v-switch';
const V_SWITCH_TAG_CONDITION_ATTRIBUTE = 'condition';
const V_CASE_TAG = 'v-case';
const V_CASE_IF_ATTRIBUTE = 'if';
const V_CASE_DEFAULT_TAG = 'v-case-default';

export class VInternalSwitchTransformer implements VInternalHtmlTransformer {

    private readonly _vAudit = new VAudit();

    transform(html: string): string {
        const parser = new DOMParser();
        let document = parser.parseFromString(html, 'text/html');
        do document = this.replaceVSwitches(document);
        while (document.getElementsByTagName(V_SWITCH_TAG).length > 0);
        return document.head.innerHTML.trim() + document.body.innerHTML.trim();
    }

    private replaceVSwitches(document: any): Document {
        const switchEls: Element[] = document.getElementsByTagName(V_SWITCH_TAG);
        for (let switchEl of switchEls) {
            const newValue = this.findSwitchElement(switchEl);
            switchEl.parentElement.innerHTML = newValue.innerHTML;
        }
        return document;
    }

    private findSwitchElement(switchEl: Element): Element {
        const condition = switchEl.attributes.getNamedItem(V_SWITCH_TAG_CONDITION_ATTRIBUTE).value;
        if (this._vAudit.isBlank(condition)) {
            throw new VTemplateRenderException(`Switch condition is empty, while it should not be!`);
        }
        const caseEl = this.findCaseElement(switchEl, condition);
        const caseDefaultEl = this.findCaseDefaultElement(switchEl);
        if (caseEl === null && caseDefaultEl === null) {
            throw new VTemplateRenderException(`No matched case and no default case found!`);
        }
        return caseEl === null ? caseDefaultEl : caseEl;
    }

    private findCaseElement(switchEl: Element, condition: any): Element | null {
        const caseEls = Array.from(switchEl.children).filter(c => c.tagName === V_CASE_TAG.toUpperCase());
        for (let caseEl of caseEls) {
            const caseValue = caseEl.attributes.getNamedItem(V_CASE_IF_ATTRIBUTE).value;
            if (caseValue === condition) {
                return caseEl;
            }
        }

        return null;
    }

    private findCaseDefaultElement(switchEl: Element): Element | null {
        const caseDefaultEl = Array.from(switchEl.children).find(c => c.tagName === V_CASE_DEFAULT_TAG.toUpperCase());
        return caseDefaultEl ? caseDefaultEl : null;
    }
}