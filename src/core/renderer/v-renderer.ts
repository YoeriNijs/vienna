import { isEmpty } from 'pincet';
import { VRendererOptions } from './v-renderer-options';
import { VComponentOptions } from '../component/v-component-options';
import { VInternalComponent } from '../internal/v-internal-component';
import { VComponentType } from '../router/v-route';
import { VLogger } from '../internal/v-logger';
import { VSanitizer } from './v-sanitizer';
import { VHtmlParser } from './v-html-parser';
import { VRendererUtil } from './v-renderer-util';
import { Type } from '../injector/v-component-injector';
import { VCallError } from './v-call-error';

interface VElement {
	publicDataName: string;
	internalDataName: string;
}

interface VDomEvent extends VElement {
	domEvent: string;
}

interface VAttributeDirective extends VElement {}

const SUPPORTED_DOM_EVENTS: VDomEvent[] = [
  { publicDataName: 'v-click', internalDataName: 'vClick', domEvent: 'click' },
];

const SUPPORTED_ATTRIBUTE_DIRECTIVES: VAttributeDirective[] = [
  { publicDataName: 'v-if', internalDataName: 'vIf' },
  { publicDataName: 'v-if-not', internalDataName: 'vIfNot' },
  { publicDataName: 'v-for', internalDataName: 'vFor' },
];

enum InternalLifeCycleHook {
	INIT,
	UNKNOWN
}

@VInternalComponent({
  name: 'VRenderer',
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

	public render(component: unknown & VComponentType, declarations: VComponentType[]) {
	  this.clear();
	  const element = this.createElement(component, declarations);
	  this._view.appendChild(element);
	}

	public createElement(component: unknown & VComponentType, declarations: VComponentType[]): HTMLElement {
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
	    const html = VHtmlParser.parse(component, options.html);

	    const parser = new DOMParser();
	    const dom = parser.parseFromString(html, 'text/html');

	    // Todo: work on a way to render nested elements (we cannot just call this method since we do not want to override the document itself)
	    // const componentSelectors = declarations.forEach(d => {
	    // 	const options: VComponentOptions = JSON.parse(d.vComponentOptions);
	    // 	const components = dom.querySelectorAll(options.selector);
	    // 	components.forEach(c => c.innerHTML = this.createElement(c, declarations).innerHTML);
	    // });

	    // Attach supported attribute directives
	    SUPPORTED_ATTRIBUTE_DIRECTIVES.forEach((vAttributeDirective) => this.attachAttributeDirective(vAttributeDirective, shadow, component, dom));

	    inner.innerHTML = dom.documentElement.innerHTML;
	    shadow.appendChild(inner);

	    // Attach supported dom events
	    SUPPORTED_DOM_EVENTS.forEach((vDomEvent) => this.attachDomEvents(vDomEvent, shadow, component, dom, declarations));

	    // Call init lifecycle hook
	    this.callLifeCycleHook(InternalLifeCycleHook.INIT, component);

	    return element;
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

	private callInternalMethod(component: VComponentType, methodName: string, htmlElement?: HTMLElement) {
	  const componentPrototype = Object.getPrototypeOf(component) || {};
	  const componentPrototypePrototype = Object.getPrototypeOf(componentPrototype) || {};
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
	    if (variablesString.length > 0) {
	      const variables = variablesString
	        .split(',')
	        .map((variableName) => VRendererUtil.getObjectValueForTemplateReference(component, variableName))
	        .forEach((value) => methodVariables.push(value));
	    }

	    // Then, just replace the method name by the name without arguments
	    methodName = methodName.substring(0, indexOfFirstParenthesis);
	  }

	  const methodIndex = methods.indexOf(methodName);
	  if (methodIndex === -1) {
	    throw new VCallError(`Invalid method name: '${methodName}'. This probably means that the method does not exist`);
	  } else {
	    // Let's call the method
	    const method = Object.getPrototypeOf(componentPrototype)[methods[methodIndex]].bind(component);
	    if (isEmpty(methodVariables) && htmlElement) {
	      return method(htmlElement);
	    } if (!isEmpty(methodVariables)) {
	      return method(methodVariables);
	    }
	    return method();
	  }
	}

	private attachDomEvents(vDomEvent: VDomEvent, shadow: ShadowRoot, component: VComponentType, dom: Document, declarations: VComponentType[]): void {
	  if (!shadow.children) {
	    return;
	  }

	  const elements = dom.querySelectorAll<HTMLElement>(`[data-${vDomEvent.publicDataName}]`);
	  if (!elements) {
	    return;
	  }

	  Array.from(elements).forEach((el) => {
	    const methodName = el.dataset[vDomEvent.internalDataName];
	    Array.from(shadow.children)
	      .filter((shadowEl) => shadowEl.nodeName !== 'STYLE')
	      .map((shadowEl: HTMLElement) => this.findMethodNameInElement(shadowEl, vDomEvent, methodName))
	      .filter((shadowEl) => shadowEl)
	      .forEach((shadowEl: HTMLElement) => {
	        shadowEl.addEventListener(vDomEvent.domEvent, () => {
	          this.callInternalMethod(component, methodName, shadowEl);
	          this.render(component, declarations); // Re-render since change may have changed
	        });
	      });
	  });
	}

	attachAttributeDirective(directive: VAttributeDirective, shadow: ShadowRoot, component: VComponentType, dom: Document): void {
	  if (!shadow.children) {
	    return;
	  }

	  const elements = dom.querySelectorAll<HTMLElement>(`[data-${directive.publicDataName}]`);
	  if (!elements) {
	    return;
	  }

	  Array.from(elements).forEach((el: HTMLElement) => {
	    const methodName = el.dataset[directive.internalDataName];
	    switch (directive.internalDataName) {
	      case 'vIf':
	        const shouldRender = this.callInternalMethod(component, methodName, el);
	        if (!shouldRender) {
	          el.parentNode.removeChild(el);
	        }
	        break;
	      case 'vIfNot':
	        const shouldNotRender = this.callInternalMethod(component, methodName, el);
	        if (shouldNotRender) {
	          el.parentNode.removeChild(el);
	        }
	        break;
	      case 'vFor':
	        const number = this.callInternalMethod(component, methodName, el);
	        for (let i = 0; i < number; i++) {
	          const clone = el.cloneNode(true);
	          el.parentNode.insertBefore(clone, el);
	        }
	        break;
	      default:
					// Not implemented
	    }
	  });
	}

	private findMethodNameInElement(element: HTMLElement, vElement: VElement, methodName: string): HTMLElement | undefined {
	  const inCurrent = element.dataset[vElement.internalDataName] === methodName;
	  if (inCurrent) {
	    return element;
	  }

	  if (element.hasChildNodes()) {
	    const children = Array.from(element.children);
	    for (let i = 0; i < children.length; i++) {
	      const child = children[i] as HTMLElement;
	      const inChild = this.findMethodNameInElement(child, vElement, methodName);
	      if (inChild) {
	        return child;
	      }
	    }
	  }

	  return undefined;
	}
}
