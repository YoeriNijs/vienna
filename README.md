# Vienna micro frontend

![Vienna logo](https://raw.githubusercontent.com/YoeriNijs/vienna/main/img/logo.png)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Do great things with this tiny framework

Vienna is a micro framework written in TypeScript and under active development. It is based on some core concepts of
the [Angular](https://angular.io) and [FatFree](https://fatfreeframework.com/) frameworks. Since Vienna is still work in 
progress, it might be unstable.

Check out the [demo application](https://github.com/YoeriNijs/vienna-demo-app).

## Table of Contents (work in progress)

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
    - [Nested routes](#nested-routes)
    - [Route data](#route-data)
    - [Route params](#route-params)
    - [Query params](#query-params)
    - [Guards](#route-guards)
    - [Route redirects](#route-redirects)
    - [SEO optimization](#seo-optimization)
- [Dependency injection](#dependency-injection)
- [Dark mode](#dark-mode)
  - [Set up dark mode](#set-up-dark-mode)
  - [Customize dark mode](#customize-dark-mode)
- [Miscellaneous](#miscellaneous)
  - [VAudit](#vaudit)
  - [VWeb](#vweb)
    - [Slugify](#slugify)
    - [Cookies](#cookies)
    - [Document tags](#override-document-tags)
- [Plugins](#plugins)
  - [Logger](#logger)
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
  accepts three strategies:
    - `Ignore`: enum. If configured, the invalid route will be ignored and the user stays on the current page.
    - `Root`: enum. If configured, the user will be navigated back to the root route the Vienna application.
    - `VRouteNotFoundRedirect`: object that holds a path field. The router will send the user to the configured path. The path should start with '/'. Example object: `{ path: '/not-found' }`.
- `rootElementSelector` (optional): can be used to specify which root element should be used by Vienna as application
  root. Default: 'body'.
- `globalStyles` (optional): can be used to inject global styles in every webcomponent. This might be handy if you want to use a css (utility) framework, such as [Tailwind](https://tailwindcss.com) or [Bulma](https://bulma.io). GlobalStyles support two kinds of globals:
  - `style`: just plain css.
  - `href`: a link to a remote stylesheet. Thus, a href should start with 'http'. Also, it is possible to pass integrity and crossorigin values  (see below).
- `darkModeEnabled` (optional): global method to initialize app-wide dark mode (see [dark mode](#dark-mode)).

For instance, if you want to use [Bulma](https://bulma.io), just add the following:

`application.ts`

```
@VApplication({
    declarations: [HomeComponent],
    routes: [
      { path: '/', component: HomeComponent }
    ],
    globalStyles: [
      {
        href: 'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css',
        integrity: "sha384-IJLmUY0f1ePPX6uSCJ9Bxik64/meJmjSYD7dHaJqTXXEBE4y+Oe9P2KBZa/z7p0Q",
        crossOrigin: "anonymous"
      }
      { style: 'body { padding: 10px; }' }
    ]
})
export class Application {}
```

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

- `VInit`: Will be executed when the component is going to be rendered in the view.
- `VAfterInit`: Will be executed when the root node and all child nodes are initialized and rendered in the view.
- `VDestroy`: Will be executed when the component is removed from the view.

If you want to use these hooks, just implement the corresponding interface (i.e. `VInit`, `VAfterInit` or `VDestroy`). For example:

`my-component.ts`

```

@VComponent({ 
  selector: 'my-component', 
  styles: [], 
  html: `Hello world!`
})
export class MyComponent implements VInit, VAfterInit, VDestroy { 
  vInit(): void { 
    alert('I am executed when this component is going to be rendered!'); 
  }
  
  vAfterInit(): void {
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

### VSwitch

In some cases, you might want to use a switch statement in your views. For this, you can use `VSwitch`. Important: you must
either have a matching case for your statement, or a default case! If one is missing, the switch will not work, since
Vienna does not know what to display in that particular situation.

```
@VComponent({
    selector: 'switch-component',
    styles: [],
    html: `
        <v-switch condition="{{ name }}">
            <v-case if="admin">
                May the force be with you!
            </v-case>
            <v-case-default>
                You have no force here.
            </v-case-default>
        </v-switch>
    `
})
export class SwitchComponent {
    name = 'admin';
}
```

## Event binding

Vienna is created to create web applications with ease. Of course, event binding is supported in the Vienna template
engine. To listen to an event on one element, just add the @mark. For instance:

`custom.component.ts`

```

@VComponent({ 
  selector: 'custom-component', 
  styles: [], 
  html: `<button @click='showAlert('Hello!')>Show alert</button>`
})
export class CustomComponent { 
  showAlert(message: string): void { 
    alert(message); 
  }
}

```

If you want to listen to keyboard events, you can pass the key name. This holds for `keyDown` and `keyUp`.

```
<div @keyDown.enter="doSomething"></div>
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
- `children` (optional): an array of `VRoute` objects that represent nested routes.
- `docTags` (optional): an array of `VRouteDocTag` objects, which are needed for seo optimization.

### Nested routes
Routes can be nested limitless. To create subroutes, just implement child routes. For example:

`application.ts`

```

@VApplication({ 
  declarations: [
    HomeComponent, 
    AboutComponent, 
    ContactComponent
  ], 
  routes: [
    { path: '/', component: HomeComponent }, 
    { 
      path: '/about', 
      component: AboutComponent,
      children: [
        { path: '/contact', component: ContactComponent }, 
      ]
    }
  ]
})
export class Application {}

```

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

<b>Important:</b> if the guard returns false for some reason, the internal Vienna router handles the current route the same as a route that isn't found. In that case, the so-called
`routeNotFoundStrategy` kicks in. You might want to adjust this strategy depending on your needs.

### Route params
Consider the following url `#/blog/1` with the following route signature `#/blog/:id`. In order to retrieve the route param 'id', you can
use the `VActivatedRoute` to retrieve a list of current `VRouteParam` values.

A `VRouteParam` holds the following values:
- `id`: the name of the route param name
- `value`: the actual route param value

`blog-post.component.ts`

```

@VComponent({ 
  selector: 'blog-post-component', 
  styles: [], 
  html: `<span>{{ id }}</span>` // prints '1'
})
export class BlogPostComponent {
    id = '';
    
    constructor(private activatedRoute: VActivatedRoute) {
        this.activatedRoute.params(params => this.id = params.find(v => v.id === 'id'));
    }
}

```

In order to add route params to Vienna, just pass them in your routes. For example:

`application.ts`

```

@VApplication({ 
  declarations: [HomeComponent, BlogComponent, BlogPostComponent], 
  routes: [
    { path: '/', component: HomeComponent }, 
    { 
      path: '/blog', 
      component: BlogComponent,
      children: [
        { path: '/:id', component: BlogPostComponent, guards: [BlogPostIdGuard] }
      ]
    },
  ]
})
export class Application {}

```

### Query params

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
        this.activatedRoute.queryParams(params => this.welcomeMsg = params.message);
    }
}

```

### Route redirects
It is very likely that an application needs to redirect to another internal or external path. Of course, it is possible to provide
a valid href in the view. However, sometimes you want to create a redirect that is not visible in your view. For this, you can use the 
`VRouteRedirect` helper class.

The VRouteRedirect supports to redirect options:
- `redirectTo`: redirects to an internal or external path. In order to navigate to another Vienna path, just provide the prefix '#' (e.g. `#/my-vienna-path`). Of course, you can navigate to an external domain as well. Just pass the complete url as-is (e.g. `https://www.some-external-site.com`). Optionally, you can specify whether you want to open the link in another window.
- `redirectToRoot`: just navigates to the root component of the Vienna app (of course, you must have a valid root path for that).

The VRouteRedirect is an injectable, which means that you can inject it in your constructor:

`custom.component.ts`

```

@VComponent({ 
  selector: 'custom-component', 
  styles: [], 
  html: ``
})
export class CustomComponent implements VInit { 
  
  constructor(private routeRedirect: VRouteRedirect) {}
  
  vInit(): void {
    setTimeout(() => this.routeRedirect.redirectTo('#/another-vienna-path', true), 2000)); // 'true' means new window here
  }
}

```

### Seo optimization
Since Vienna is in the end a framework that runs client side, it may be difficult for web crawlers to scan Vienna pages
for content. Vienna can help these crawlers by injecting the necessary title and meta tags in the document, since
these crawlers heavily rely on these tags. This will improve the seo of the application.

To use the document tags, just add them to your route. If you have nested routes, the most specific route 'wins'.
Hence, the tags of the most specific route are added to the dom, while the tags of the parents are ignored.

`application.ts`

```

@VApplication({ 
  declarations: [
    HomeComponent
  ], 
  routes: [
    { 
      path: '/', 
      component: HomeComponent,
      docTags: {
        title: 'My fancy home title',
        meta: [{ name: 'author', content: 'Lucky Luke' }]
      }
    }
  ]
})
export class Application {}

```

If you want to create document tags inside the component itself, because, for instance, you need some specific data, just use the [override method](#override-document-tags) from the `VWeb` utility.

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

## Dark mode
Nowadays, dark mode is very convenient to add some additional usability features to your application. Some people like
dark apps more than light apps, and for some it is even a necessity to use an app.

### Set up dark mode
Luckily, Vienna comes with dark mode out of the box. There are two ways to enable dark mode. The easiest way is to set
up dark mode in your application config by using the so-called `darkModeEnabled` hook. It is just a method that should
return true or false. If it returns true, dark mode will be enabled for the whole application. For instance:

`application.ts`

```
@VApplication({
    declarations: [],
    routes: [],
    darkModeEnabled: () => {
      // ... Some custom logic here. 
      return true; 
    }
})
export class Application {}
```

If dark mode is enabled, by default, Vienna will apply a `v-dark` css class to all elements in the dom. Then, you have 
various possibilities to style the dark selectors. For instance, just inject some global styling to set some default for
the v-dark class (e.g. a specific background color and specific text color). Or, you can apply custom css rules for all
your Vienna components separately.

Vienna is flexible, though. For instance, you can apply dark mode initially, but later disable it. Or, you can disable 
dark mode by default, and manually enable it later. To do this, you only need to inject the `VDarkMode` helper somewhere:

```
@VComponent({
    selector: 'dark-mode-component',
    html: `
        <div class='background'>
            <h2>Some title</h2>
            
            <v-check if="{{ isDarkModeEnabled }}">
                <true>
                    <button @click="disableDarkMode()">Disable dark mode</button>
                </true>
                <false>
                    <button @click="enableDarkMode()">Enable dark mode</button>
                </false>
            </v-check>
        </div>`,
    styles: [`
        .v-dark {
            background-color: #000;
            color: #fff;
        }
    `]
})
export class DarkModeComponent implements VInit {

    isDarkModeEnabled = false;

    constructor(private darkMode: VDarkMode) {}

    vInit(): void {
        this.isDarkModeEnabled = this.darkMode.isDarkModeEnabled();
    }

    enableDarkMode(): void {
        this.darkMode.enableDarkMode();
    }

    disableDarkMode(): void {
        this.darkMode.disableDarkMode();
    }
}
```

### Customize dark mode
If you want to customize the `v-dark` class for some reason, you can choose between an application-wide class set up of
a component override. To apply the application-wide option, just pass the `darkModeClassOverride` to your application
config:

`application.ts`

```
@VApplication({
    declarations: [],
    routes: [],
    darkModeEnabled: () => {...},
    darkModeClassOverride: 'my-custom-dark-mode-class'
})
export class Application {}
```

Or if you want to specify a custom class in you component, apply the `darkModeClassOverride`:

```
@VComponent({
    selector: 'dark-mode-component',
    html: ...,
    styles: [...],
    darkModeClassOverride: 'my-custom-dark-mode-class'
})
export class DarkModeComponent implements VInit {...}
```

<b>Important:</b> a Vienna component option is always more specific than some application-wide config. Therefore, if you
apply dark mode settings to a component, these settings will always be true. For instance, if you set up a custom dark 
mode class globally, and have another custom class in your component, the latter will be used.

## Miscellaneous
Vienna provides various handy miscellaneous tools that you can use.

### VAudit
Vienna provides a data validator class that you can use to verify multiple data fields. Currently, the following
methods are supported:

- `isValidUrl` (http or https is required)
- `isValidEmail`
- `isValidIp4`
- `isValidIp6`
- `isBlank`
- `isUserAgentBot`

The Vienna data validator is called `VAudit`, and is an injectable. Hence, just inject it in your code:

```
@VComponent({...})
export class MyComponent implements VInit {

  constructor(private _audit: VAudit) {}

  vInit(): void {
    const url = 'https://www.my-url.com';
    this._audit.isValidUrl(url); // true
  }
}
```

### VWeb
Vienna provides basic web utilities, which are all available under the so-called `VWeb` class. This class is an injectable.

#### Slugify
For creating slugs. You can pass the following optional options: `trim` and `toLowerCase`.

```
@VComponent({...})
export class MyComponent implements VInit {

  constructor(private _web: VWeb) {}

  vInit(): void {
    const value = 'my string';
    this._web.slugify(value); // 'my-string'
  }
}
```

#### Cookies
Cookies let you store user information in web pages. Vienna helps you with this by providing an easy api for storing, 
retrieving and removing cookies. For this, Vienna uses the fully-tested and commonly used [js-cookie](https://github.com/js-cookie/js-cookie) library
under the hood. In this case, Vienna acts as simple proxy.

```
@VComponent({...})
export class MyComponent implements VInit {

  constructor(private _web: VWeb) {}

  vInit(): void {
    // Set cookie
    this._web.setCookie('cookieName', 'cookieValue');
    
    // Set cookie with options
    this._web.setCookie('cookieName', 'cookieValue', { secure: true });
    
    // Read cookie
    this._web.getCookie('cookieName'); // 'cookieValue'
    
    // Remove cookie
    this._web.removeCookie('cookieName');
  }
}
```

#### Override document tags
VWeb provides a method to override document tags that are set in the Vienna route as [VRouteDocTag](#seo-optimization).
This may be helpful in situations where you want to create dynamic titles (e.g. correspondig to a specific blog post).

In order to use this simple utility method, you need to call it inside the `VAfterInit` hook, since document tags in the current
route tree are called first.

```
@VComponent({...})
export class MyComponent implements VAfterInit {

  const post = {
    title: 'Blogpost title',
    body: 'Some body',
    author: 'Lucky Luke'
  };

  constructor(private _web: VWeb) {}

  vAfterInit(): void {
    this._web.overrideTags({
      title: this.post.title,
      meta: [ { name: 'author', content: this.post.author } ]
    });
  }
}
```

## Plugins
Plugins are pieces of optional utilities that you can configure inside Vienna. They are not mandatory, because they do not
belong to the core of the Vienna framework. However, they might be handy to use.

### Logger
Vienna ships a basic logger implementation that you can configure to send messages to an external logging provider, such as Sentry. 
To get started with the logger, just configure the plugin in your application config:

`application.ts`

```
@VApplication({
    declarations: [],
    routes: [],
    plugins: {
      logger: {
          process: logs => // ... your implementation (e.g. send logs to some external provider)
      }
    }
})
export class Application {}
```

Everytime a log line is recorded, the process method will be called. To use the logger, just inject it:

```
@VComponent({...})
export class MyComponent implements VInit {

  constructor(private _logger: VLogger) {}

  vInit(): void {
    this._logger.info('Some info log');
  }
}
```

The output of the `process` method will be:

```
[{ type: 'info', msg: 'Some info log' }]
```

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
- Use Rollup instead of Webpack since it generates a much smaller bundle size

# Known issues

- Event listener (such as click) may stop intervals and timeouts in same component
- VProp is leaking state when routing to subcomponent that has input binding
- VInit does not work without callback yet
- Running tests with vComponentFactory may cause Jest open handles issue. As a workaround, you can enable fake timers in
  the Jest config or explicitly disable real timers in your tests (do not forget to re-enable them!).

# Literature

- https://www.thinktecture.com/en/web-components/flaws/
- https://hackernoon.com/how-to-create-new-template-engine-using-javascript-8f26313p
- https://www.raresportan.com/object-change-detection/ (using Proxy)
- https://fatfreeframework.com/3.7/views-and-templates (nice example of directive syntax)~~
