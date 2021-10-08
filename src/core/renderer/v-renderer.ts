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

		const key = Object.keys(component).find(key => templateReference.startsWith(key));
		if (!key) {
			return html;
		}

		// Find actual value for reference
		let value = (component as any)[key];
		if (templateReference.indexOf('.') !== -1 && typeof value === 'object') {
			const prop = templateReference.substring(templateReference.indexOf('.') + 1, templateReference.length);
			prop.split('.').forEach(nestedProp => value = value[nestedProp]); // To the nested prop we go
		}
		value = typeof value === 'string' ? VSanitizer.sanitizeHtml(value) : value;

		// Teplace template reference by actual value
		const templateReferenceWithBrachets = html.substring(start, end + 2);
		html = html.replace(templateReferenceWithBrachets, value);

		return this.convertBrackets(component, html);
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
