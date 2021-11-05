import {VInternalHtmlAttribute} from "./v-internal-html-attribute";

export const VInternalHtmlAttributeMap: VInternalHtmlAttribute[] = [
    {clientAttrName: '@bind', internalClientAttrName: 'data-v-bind', internalAttrName: 'vBind'},
    {clientAttrName: '@click', internalClientAttrName: 'data-v-click', internalAttrName: 'vClick', domEvent: 'click'},
    {clientAttrName: '@emit', internalClientAttrName: 'data-v-emit', internalAttrName: 'vEmit'}
];