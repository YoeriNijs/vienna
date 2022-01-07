# Vienna (very alpha, still in development)

![Vienna logo](https://raw.githubusercontent.com/YoeriNijs/vienna/main/img/logo.png)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Do great things with this tiny framework

Vienna is a small framework under active development. It is based on some core concepts of
the [Angular](https://angular.io) and [FatFree](https://fatfreeframework.com/) frameworks.

# Table of Contents (work in progress)

- [Install Vienna](#install)
- [Set up application](#set-up-application)
- [Component creation](#create-components)
- [Component binding](#component-binding)
    - [Input binding](#input-binding)
    - [Output binding](#output-binding)
    - [Element binding](#element-binding)
- [Component lifecycle hooks](#component-lifecycle-hooks)
- [Conditional segments](#conditional-segments)
    - [VCheck](#vcheck)
    - [VRepeat](#vrepeat)
- [Event binding](#event-binding)
- [Routes](#routes)
    - [Route data](#route-data)
    - [Route params](#route-params)
    - [Guards](#route-guards)
- [Dependency injection](#dependency-injection)
- [Component testing](#component-testing)

## Install

```
npm install vienna-ts
```

Or start with the [starter template](https://github.com/YoeriNijs/vienna-starter-template) right away.

## Set up application

In order to get started with Vienna, you need a root class that holds the `VApplication` decorator. This root class is
responsible for all declarations, routes and other application wide configuration. At the moment, declarations and
routes are mandatory, so:

`application.ts`

```
@VApplication({
    declarations: [],
    routes: []
})
export class Application {}
```

To get started, just create a [component](#create-components) and add the component to your declarations. Furthermore,
specify the root route by adding a [route](#routes) that holds the root path:

`application.ts`

```
@VApplication({
    declarations: [HomeComponent],
    routes: [
      { path: '/', component: HomeComponent }
    ]
})
export class Application {}
```

<b>Don't forget to actually declare the application class. Otherwise, your app won't run!</b>

Currently, the `VApplication` decorator accepts a so-called `VApplicationConfig`. In this config, you can specify the
following:

- `declarations` (mandatory): holds all Vienna components that you want to use in your application.
- `routes` (mandatory): holds all Vienna routes for your application.
- `routeNotFoundStrategy` (optional): can be used to specify another strategy if a route is not found. Currently, Vienna
  accepts two strategies:
    - `Ignore`: ignore the invalid route and just stay on the current page.
    - `Root`: navigate user back to the root route of the Vienna application if the route is invalid.
- `rootElementSelector` (optional): can be used to specify which root element should be used by Vienna as application
  root. Default: 'body'.

## Create components

Vienna is based on the concept of components. A component is a small piece of code that holds it's own encapsulated
logic and styling. One is able to create various components, and a component is able to make use of other components.

To create a component in Vienna, you need the `VComponent` decorator. A component holds three properties: a selector
(that needs to consist of at least two parts and is hyphen-separated), some styles, and html. For instance:

`my-component.ts`

```
@VComponent({
    selector: 'my-component',
    styles: [`
      span {
        background-color: red;
        color: white;
      }
    `],
    html: '<span>Hello there!</span>'
})
export class MyComponent {}
```

Then, just declare the new component in your application root by appending it to the declarations array:

`application.ts`

```
@VApplication({
    declarations: [MyComponent],
    routes: []
})
export class Application {}
```

Currently, the styles array only accepts strings. The same holds for the html part: it only accepts a string for now.

## Component binding

When an application grows, one needs to pass data from one component to another. For this, it is possible to use
component binding.

### Input binding

Since Vienna uses the fundamentals of webcomponents, it is possible to render components inside components. In order to
pass data from one component to another, the so-called `VProp` decorator is needed. For example:

`component-a.ts`

```
@VComponent({
    selector: 'component-a',
    styles: [],
    html: '<span>{{ message }}</span>'
})
export class ComponentA {
  @VProp() message: string = '';
}
```

`component-b.ts`

```
@VComponent({
    selector: 'component-b',
    styles: [],
    html: '<component-a message="Hello from ComponentB!"></component-a>'
})
export class ComponentB {}
```

### Output binding

To bind to component outputs, it is possible to implement the `VEmitter`:

`component-a.ts`

```
@VComponent({
    selector: 'component-a',
    styles: [],
    html: '<span>{{ message }}</span>'
})
export class ComponentA {
    message = 'Hello from Earth';
    
    @VEmit('messageChange')
    messageChange: VEmitter<string> = new VEmitter<string>();
    
    constructor() {
      setTimeout(() => {
        this.message = 'Hello from Mars';
        this.messageChange.emit(this.message);
      }, 3000);
    }
}
```

`component-b.ts`

```
@VComponent({
    selector: 'component-b',
    styles: [],
    html: '<component-a @emit="messageChange => printNewMessage(message)"></component-a>'
})
export class ComponentB {
  printNewMessage(message: string): void {
    alert(`Retrieved from ComponentA: ${message}`);
  }
}
```

### Element binding

Interested in the actual value of an element inside your view? Just add bind!

`custom.component.ts`

```
@VComponent({
    selector: 'custom-component',
    styles: [],
    html: '<input @bind="textInput" id="textInput" type="text" placeholder="Some text" minlength="1" />'
})
export class CustomComponent implement VInit {
    textInput: HTMLInputElement;
    
    vInit(): void {
        setInterval(() => console.log(this.textInput.value), 1000));
    }
}
```

## Component lifecycle hooks

It is possible to use a component lifecycle hook to perform some logic. Vienna supports two hooks at the moment:

- `VInit`: Will be executed when the component is rendered in the view.
- `VDestroy`: Will be executed when the component is removed from the view.

If you want to use these hooks, just implement the corresponding interface (i.e. `VInit` or `VDestroy`). For example:

`my-component.ts`

```

@VComponent({ 
  selector: 'my-component', 
  styles: [], 
  html: `Hello world!`
})
export class MyComponent implements VInit, VDestroy { 
  vInit(): void { 
    alert('I am executed when this component is rendered!'); 
  }

  vDestroy(): void { 
    alert('I am executed when this component is removed!'); 
  } 
}

```

## Conditional segments

Conditional segments can help you to enrich your html by adding some view logic.

### VCheck

With VCheck, you can specify when an element should be rendered by checking a value or function. It is mandatory to add
at least one true or one false element, but you do not need to declare both. The true and false elements should hold one
html element at the minimum.

The most simple way to use VCheck is to refer to a component field:

`my-component.ts`

```

@VComponent({ 
  selector: 'my-component', 
  styles: [], 
  html: `
    <v-check if="{{ isLoggedIn }}">
      <true>
        <span>You are logged in!</span>
      </true>
      <false>
        <span>You are not logged in!</span>
      </false>
    </v-check>
  `
})
export class MyComponent { 
  isLoggedIn = true; 
}

```

It is also possible to perform a method call prior to rendering:

`my-component.ts`

```

@VComponent({ 
  selector: 'my-component', 
  styles: [], 
  html: `
    <v-check if="isLoggedIn()">
      <true>
        <span>You are logged in!</span>
      </true>
      <false>
        <span>You are not logged in!</span>
      </false>
    </v-check>
  `
})
export class MyComponent { 
  isLoggedIn(): boolean { 
    return true; 
  } 
}

```

### VRepeat

With VRepeat, you can easily multiply elements. It is also possible to use a variable for every element that you render.
For instance:

`my-component.ts`

```

@VComponent({ 
  selector: 'my-component', 
  styles: [], 
  html: `
      <v-repeat let="{{ i }}" for="['first', 'second', 'third']">
        <span>{{ i }}</span>
      </v-repeat>
  `
})
export class MyComponent {}

```

It is also possible to make use of a component array:

`my-component.ts`

```

@VComponent({ 
  selector: 'my-component', 
  styles: [], 
  html: `
    <v-repeat let="{{ person }}" for="{{ persons }}">
      <span>{{ person.name }}</span>
      <span>{{ person.age }}</span>
    </v-repeat>
  `
})
export class MyComponent { 
  persons = [
    { name: 'Bert', age: 30 }, 
    { name: 'Ernie', age: 60 }
  ]; 
}

```

## Event binding

Vienna is created to create web applications with ease. Of course, event binding is supported in the Vienna template
engine. It supports the following dom events:

- Abort (@abort)
- Afterprint (@afterPrint)
- Animationend (@animationEnd)
- Animationiteration (@animationIteration)
- Animationstart (@animationStart)
- Beforeprint (@beforePrint)
- Beforeunload (@beforeUnload)
- Canplay (@canPlay)
- canplaythrough (@canPlayThrough)
- Change (@change)
- Click (@click)
- Contextmenu (@contextMenu)
- Copy (@copy)
- Cut (@cut)
- Dblclick (@dblClick)
- Drag (@drag)
- Dragend (@dragEnd)
- Dragenter (@dragEnter)
- Dragleave (@dragLeave)
- Dragover (@dragOver)
- Dragstart (@dragStart)
- Drop (@drop)
- Durationchange (@durationChange)
- Ended (@ended)
- Error (@error)
- Focus (@focus)
- Focusin (@focusIn)
- Focusout (@focusOut)
- Fullscreenchange (@fullScreenChange)
- Fullscreenerror (@fullScreenError)
- Hashchange (@hashChange)
- Input (@input)
- Invalid (@invalid)
- KeyDown (@keyDown)
- KeyPress (@keyPress)
- KeyUp (@keyUp)
- Load (@load)
- LoadedData (@loadedData)
- LoadedMetadata (@loadedMetadata)
- LoadStart (@loadStart)
- Message (@message)
- MouseDown (@mouseDown)
- MouseUp (@mouseUp)
- Offline (@offline)
- Online (@online)
- Open (@open)
- PageHide (@pageHide)
- PageShow (@pageShow)
- Paste (@paste)
- Pause (@pause)
- Play (@play)
- Playing (@playing)
- Progress (@progress)
- RateChange (@rateChange)
- Resize (@resize)
- Reset (@reset)
- Scroll (@scroll)
- Search (@search)
- Seeked (@seeked)
- Seeking (@seeking)
- Select (@select)
- Show (@show)
- Stalled (@stalled)
- Submit (@submit)
- Suspend (@suspend)
- TimeUpdate (@timeUpdate)
- Toggle (@toggle)
- TouchCancel (@touchCancel)
- TouchEnd (@touchEnd)
- TouchMove (@touchMove)
- TouchStart (@touchStart)
- TransitionEnd (@transitionEnd)
- Unload (@unload)
- VolumeChange (@volumeChange)
- Waiting (@waiting)
- Wheel (@wheel)

To listen to an event on one element, just add the @ mark. For instance:

`custom.component.ts`

```

@VComponent({ 
  selector: 'custom-component', 
  styles: [], 
  html: `<button @click='showAlert('Hello!')>Show alert</button>`
})
export class HomeComponent { 
  showAlert(message: string): void { 
    alert(message); 
  }
}

```

## Routes

In order to use your Vienna application, you need to specify routes. With these routes, Vienna knows which components it
should render for the corresponding paths.

To create a route, just add it to the `VApplication` decorator. The path and component properties are mandatory. For
instance:

`application.ts`

```

@VApplication({ 
  declarations: [HomeComponent, AboutComponent], 
  routes: [
    { path: '/', component: HomeComponent }, 
    { path: '/about', component: AboutComponent }
  ]
})
export class Application {}

```

Besides the path and component properties, the `VRoute` interface accepts the following optional values:

- `data` (optional): key-value based map to specify some custom values for that specific route.
- `guards` (optional): implementations of the `VRouteGuard` interface that allow you to control the accessibility of a
  route based on a custom condition.

### Route data

Optional key-value based map to specify some custom values for a specific route.

`application.ts`

```

@VApplication({ 
  declarations: [HomeComponent], 
  routes: [
    { 
      path: '/', 
      component: HomeComponent, 
      data: { titleOverride: 'My custom title override' } 
    }
  ]
})
export class Application {}

```

In order to access the route data, you need to inject the `VActivatedRoute` in the constructor of your component:

`home-component.ts`

```

@VComponent({ 
  selector: 'home-component', 
  styles: [], 
  html: `<span>{{ title }}</span>`
})
export class HomeComponent {
    title = '';
    
    constructor(private activatedRoute: VActivatedRoute) {
        this.activatedRoute.data(data => this.title = data.titleOverride);
    }
}

```

### Route guards

Optional implementations of the `VRouteGuard` interface that allow you to control the accessibility of a route based on
a custom condition.

`cookie.guard.ts`

```

export class CookieGuard implements VRouteGuard {
    guard(): boolean {
        return sessionStorage.getItem('allowedToUseCookies') === 'true';
    }
}

```

Then, add your guard to the route that you want to control:
`application.ts`

```

@VApplication({ 
  declarations: [HomeComponent, ComponentWithAnalytics], 
  routes: [
    { path: '/', component: HomeComponent }, 
    { path: '/lorem', component: ComponentWithAnalytics, guards: [CookieGuard] },
  ]
})
export class Application {}

```

A guard can make use of the current route, by adding the `VRoute` as argument. For instance:

`authorized.guard.ts`

```

@VInjectable()
export class AuthorizedGuard implements VRouteGuard {
    constructor(protected loginService: LoginService) {}

    guard(route: VRoute): boolean {
        const userRole = this.loginService.role;
        const authorizedForRole = route.data.authorizedForRole;
        return userRole && authorizedForRole && userRole === authorizedForRole
    }
}

```

Please note that this guard uses the `VInjectable` decorator for dependency injection. Without this decorator, we are
unable to inject the LoginService. Please see dependency injection for more information.

### Route params

Consider the following url: `#/dashboard?message=Hello%20there`. In order to retrieve the query param 'message', you can
use the `VActivatedRoute`:

`dashboard.component.ts`

```

@VComponent({ 
  selector: 'dashboard-component', 
  styles: [], 
  html: `<span>{{ welcomeMsg }}</span>` // prints 'Hello there'
})
export class DashboardComponent {
    welcomeMsg = '';
    
    constructor(private activatedRoute: VActivatedRoute) {
        this.activatedRoute.params(params => this.welcomeMsg = params.message);
    }
}

```

## Dependency injection

Vienna provides a basic implementation of dependency injection, that uses reflection under the hood. In order to inject
a dependency, like a service, in another class, like a component, you need to provide the `VInjectable` decorator:

`custom.service.ts`

```

@VInjectable()
export class CustomService {
  getHelloWorld(): string { 
    return 'Hello world!'; 
  } 
}

```

`custom.component.ts`

```

@VComponent({ 
  selector: 'custom-component', 
  styles: [], 
  html: `<span>{{ message }}</span>` // prints 'Hello world!'
})
export class CustomComponent {
    message = '';
    
    constructor(protected customService: CustomService) {
        this.message = customService.getHelloWorld();
    }
}

```

By default, all injectable classes are singleton. If you do not want this for some reason, you can create a fresh
instance for every injection. For this, just set singleton to false:

````

@VInjectable({ singleton: false })
export class CustomService {...}

````

## Component testing

Vienna is still under construction. However, there is a basic testbed available to test Vienna components with ease:

```
@VComponent({
    selector: 'custom-component',
    styles: [' :host { margin: 0; padding: 0; }'],
    html: `<span>{{ message }}</span><span>Lorem Ipsum</span>`
})
export class CustomComponent {
    message = 'Some text'
}

describe('VComponentFactory', () => {

    let component: VTestComponent<CustomComponent>;

    beforeEach(() => {
        const createComponent = vComponentFactory<CustomComponent>({
            component: CustomComponent,
        });
        component = createComponent();
    });

    it('should have valid styles', () => {
        expect(component.styles).toEqual('body { padding: 0; margin: 0; } :host { margin: 0; padding: 0; }');
    });

    it('should have valid html', () => {
        expect(component.html).toEqual('<span>Some text</span><span>Lorem Ipsum</span>');
    });

    it('should have valid contents', () => {
        expect(component.query('span').innerHTML).toEqual('Some text');
        expect(component.queryAll('span')).toHaveLength(2);
        expect(component.queryAll('span')[1].innerHTML).toEqual('Lorem Ipsum');
    });
})
```

# Todo

- Add renderer cache to increase rendering performance (e.g. use render event for one component + internal component id
  instead of all)
- Add unit tests
- Work with global styling somehow (e.g. Constructable Stylesheet Objects,
  see https://wicg.github.io/construct-stylesheets/)
- Use Rollup instead of Webpack since it generates a much smaller bundle size

# Known issues

- Event listener (such as click) may stop intervals and timeouts in same component
- VProp is leaking state when routing to subcomponent that has input binding
- VInit does not work without callback yet

# Ideas

- Support optional dark mode (css variables)

# Literature

- https://www.thinktecture.com/en/web-components/flaws/
- https://hackernoon.com/how-to-create-new-template-engine-using-javascript-8f26313p
- https://www.raresportan.com/object-change-detection/ (using Proxy)
- https://fatfreeframework.com/3.7/views-and-templates (nice example of directive syntax)~~
