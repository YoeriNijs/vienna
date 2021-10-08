import {VRendererOptions} from "./v-renderer-options";
import {VComponentOptions} from "../component/v-component-options";
import {VInternalComponent} from "../internal/v-internal-component";
import {VComponentType} from "../router/v-route";
import {VLogger} from "../internal/v-logger";
import {VRenderError} from "./v-render-exception";
import {VSanitizer} from "./v-sanitizer";
import { VCallException } from "./v-call-exception";
import { isEmpty } from 'pincet';

interface VDomEvent {
	publicDataName: string;
	internalDataName: string;
	domEvent: string;
}

const SUPPORTED_DOM_EVENTS: VDomEvent[] = [
	{ publicDataName: 'v-click', internalDataName: 'vClick', domEvent: 'click' }
];

enum InternalLifeCycleHook {
	INIT,
	UNKNOWN
}

@VInternalComponent({
	name: 'VRenderer'
})
export class VRenderer {
	private readonly _view: HTMLElement;

	constructor(private options: VRendererOptions) {
		this._view = document.createElement(this.options.selector);
		const body = document.querySelector('body');
		if (body) {
			body.appendChild(this._view);
		} else {
			VLogger.error('No body tag found');
		}
	}

	public render(component: unknown & VComponentType) {
		this.clear();

		if (component.vComponentOptions) {
			const options: VComponentOptions = JSON.parse(component.vComponentOptions);

			// Create element
			const element = document.createElement(options.selector);
			const encapsulationMode = options.encapsulationMode ? options.encapsulationMode : 'closed';
			const shadow = element.attachShadow({ mode: encapsulationMode });

			// Attach styles
			const style = document.createElement('style');
			style.innerHTML = options.styles.length < 1 ? '' : options.styles.join();
			shadow.appendChild(style);

			// Attach html
			const inner = document.createElement('div');
			const html = this.convertBrackets(component, options.html);

			const parser = new DOMParser();
			let dom = parser.parseFromString(html, 'text/html');

			inner.innerHTML = dom.documentElement.innerHTML;
			shadow.appendChild(inner);

			// Attach supported dom events
			SUPPORTED_DOM_EVENTS.forEach(vDomEvent =>
				this.attachDomEvents(vDomEvent, shadow, component, dom));

			// Build
			this._view.appendChild(element);

			// Call init lifecycle hook
			this.callLifeCycleHook(InternalLifeCycleHook.INIT, component);
		}
	}

	private convertBrackets(component: unknown & VComponentType, html: string): string {
		const start = html.indexOf('{{');
		if (start <= 0) {
			return html;
		}
		const end = html.indexOf('}}');
		if (end <= 0) {
			throw new VRenderError('Template parsing error: no closing brackets found');
		}
		const rawVariablePart = html.substring(start + 2, end);
		const templateReference = rawVariablePart.trim();
		if (!templateReference) {
			throw new VRenderError('Template parsing error: unknown variable name');
		}

		// Replace template reference by actual value
		const refWithBrackets = html.substring(start, end + 2);
		const actualValue = this.getObjectValueForTemplateReference(component, templateReference);
		html = html.replace(refWithBrackets, actualValue);

		return this.convertBrackets(component, html);
	}

	private getObjectValueForTemplateReference(component: unknown & VComponentType, templateReference: string) {
		const key = Object.keys(component).find(key => templateReference.startsWith(key));
		if (!key) {
			throw new VRenderError(`Template parsing error: cannot find value for template reference '${templateReference}'`)
		}

		// Find actual value for reference
		let value = (component as any)[key];
		if (templateReference.indexOf('.') !== -1 && typeof value === 'object') {
			const prop = templateReference.substring(templateReference.indexOf('.') + 1, templateReference.length);
			prop.split('.').forEach(nestedProp => value = value[nestedProp]); // To the nested prop we go
		}

		return typeof value === 'string' ? VSanitizer.sanitizeHtml(value) : value;
	}

	public clear(): void {
		this._view.innerHTML = '';
	}

	private callLifeCycleHook(hook: InternalLifeCycleHook, component: VComponentType): void {
		switch (hook) {
			case InternalLifeCycleHook.INIT:
				this.callInternalMethod(component, 'vInit');
				break;
			case InternalLifeCycleHook.UNKNOWN:
			default:
				// Intended fall-through
		}
	}

	private callInternalMethod(component: VComponentType, methodName: string, htmlElement?: HTMLElement): void {
		const componentPrototype = Object.getPrototypeOf(component) || {};
		const componentPrototypePrototype = Object.getPrototypeOf(componentPrototype) || {}
		const methods = Object.getOwnPropertyNames(componentPrototypePrototype);
		if (!methods || methods.length < 1) {
			return;
		}

		const methodVariables: any[] = [];

		const indexOfFirstParenthesis = methodName.indexOf('(');
		const indexOfLastParenthesis = methodName.indexOf(')');
		if (indexOfFirstParenthesis !== -1 && indexOfLastParenthesis !== -1) {
			// First, we find the actual values for the variables that we have some references for
			const variablesString = methodName.substring(indexOfFirstParenthesis + 1, indexOfLastParenthesis);
			const variables = variablesString
				.split(',')
				.map(variableName => this.getObjectValueForTemplateReference(component, variableName))
				.forEach(value => methodVariables.push(value));

			// Then, just replace the method name by the name without arguments
			methodName = methodName.substring(0, indexOfFirstParenthesis);
		}

		const methodIndex = methods.indexOf(methodName);
		if (methodIndex === -1) {
			throw new VCallException(`Invalid method name: '${methodName}'. This probably means that the method does not exist`)
		} else {

			// Let's call the method
			const method = Object.getPrototypeOf(componentPrototype)[methods[methodIndex]].bind(component);
			if (isEmpty(methodVariables) && htmlElement) {
				method(htmlElement);
			} else if (!isEmpty(methodVariables)) {
				method(methodVariables);
			} else {
				method();
			}
		}
	}

	private attachDomEvents(vDomEvent: VDomEvent, shadow: ShadowRoot, component: VComponentType, dom: Document): void {
		if (!shadow.children) {
			return;
		}

		const elements = dom.querySelectorAll<HTMLElement>(`[data-${vDomEvent.publicDataName}]`);
		if (!elements) {
			return;
		}

		Array.from(elements).forEach(el => {
			const methodName = el.dataset[vDomEvent.internalDataName];
			Array.from(shadow.children)
				.filter(shadowEl => shadowEl.nodeName !== 'STYLE')
				.map(shadowEl => Array.from(shadowEl.children)
					.find((shadowEl: HTMLElement) => shadowEl.dataset[vDomEvent.internalDataName] === methodName))
				.forEach((shadowEl: HTMLElement) =>
					shadowEl.addEventListener(vDomEvent.domEvent, () =>
						this.callInternalMethod(component, methodName, shadowEl)));
		});
	}
}
