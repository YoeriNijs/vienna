import {VRendererOptions} from "./v-renderer-options";
import {VComponentOptions} from "../component/v-component-options";
import {VInternalComponent} from "../internal/v-internal-component";
import {VComponentType} from "../router/v-route";
import {VLogger} from "../internal/v-logger";
import {VRenderError} from "./v-render-exception";
import {VSanitizer} from "./v-sanitizer";

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
		const bodies = document.getElementsByTagName('body');
		if (!bodies || bodies.length < 1) {
			VLogger.error('No body tag found');
		} else {
			bodies[0].appendChild(this._view);
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
		const descriptors = Object.getOwnPropertyDescriptors(component);
		const rawValue = this.findValueInDescriptors(descriptors, descriptors, templateReference);
		const value = typeof rawValue === 'string' ? VSanitizer.sanitizeHtml(rawValue) : rawValue;

		// TODO: find more elegant way to replace variable
		html = html.replace(`{{ ${templateReference} }}`, value);
		html = html.replace(`{{${templateReference}}}`, value);

		return this.convertBrackets(component, html);
	}

	private findValueInDescriptors(originalDescriptors: any, newDescriptors: any, templateReference: string): string {
		if (originalDescriptors && originalDescriptors[templateReference] && originalDescriptors[templateReference].value) {
			return originalDescriptors[templateReference].value;
		}
		const indexOfDot = templateReference.indexOf('.');
		if (indexOfDot === -1) {
			if (originalDescriptors && originalDescriptors[newDescriptors]
				&& originalDescriptors[newDescriptors].value && originalDescriptors[newDescriptors].value[templateReference]) {
				return originalDescriptors[newDescriptors].value[templateReference];
			} else if (originalDescriptors && originalDescriptors.value
				&& originalDescriptors.value[newDescriptors] && originalDescriptors.value[newDescriptors][templateReference]) {
				return originalDescriptors.value[newDescriptors][templateReference];
			} else if (originalDescriptors.value && originalDescriptors.value[templateReference]) {
				return originalDescriptors.value[templateReference];
			} else {
				throw new VRenderError(`Cannot find value for template reference '${templateReference}' and object '${newDescriptors}'`);
			}
		} else {
			const nestedDescriptor = templateReference.substring(0, indexOfDot);
			const nestedField = templateReference.replace(nestedDescriptor + '.', '');
			const parentDescriptor = Object.getOwnPropertyDescriptor(originalDescriptors, nestedDescriptor);
			if (parentDescriptor && parentDescriptor.value) {
				return this.findValueInDescriptors(parentDescriptor.value, nestedDescriptor, nestedField);
			} else {
				return this.findValueInDescriptors(originalDescriptors, nestedDescriptor, nestedField);
			}
		}
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

		// Strip of any parenthesis in order to map it to the right method name
		const indexOfFirstParenthesis = methodName.indexOf('(');
		if (indexOfFirstParenthesis !== -1) {
			methodName = methodName.substring(0, indexOfFirstParenthesis);
		}

		const methodIndex = methods.indexOf(methodName);
		if (methodIndex !== -1) {
			const method = Object.getPrototypeOf(componentPrototype)[methods[methodIndex]].bind(component);
			if (htmlElement) {
				method(htmlElement);
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
