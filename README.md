# Vienna (very alpha, still in development)

![Vienna logo](https://raw.githubusercontent.com/YoeriNijs/vienna/main/img/logo.png)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Because small code is also nice

Vienna is a small framework under active development and, for me, just a way to discover how frameworks like Angular actually work under the
hood. Vienna is based on some core fundamentals of Angular.

This is just one big WIP. Please, forgive my ugly code, lack of unit tests and documentation, and so on.

See demo app to see how the framework works.

# Table of Contents (work in progress)

1. [Install Vienna](#install)
2. [Set up base application](#set-up-base-application)
3. [Create components](#create-components)

## Install

```
npm install vienna-ts
```

## Set up base application

In order to get started with Vienna, you need a root class that holds the `VApplication` decorator. This root class is responsible for all
declarations, routes and other application wide configuration properties. At the moment, declarations and routes are mandatory, so:

`application.ts`

```
@VApplication({
    declarations: [],
    routes: []
})
export class Application {}
```

<b>Don't forget to actually declare the application class. Otherwise, your app won't run!</b>

Currently, the `VApplication` decorator accepts a so-called `VApplicationConfig`. In this config, you can specify the following:

- `declarations`: mandatory. Holds all Vienna components that you want to use in your application. See the component chapter for more
  information.
- `routes`: mandatory. Holds all Vienna routes for your application. See route chapter for more information.
- `routeNotFoundStrategy`: optional. Can be used to specify another strategy if a route is not found. Currently, Vienna accepts two
  strategies:
    - `Ignore`: ignore the invalid route and just stay on the current page.
    - `Root`: navigate user back to the root route of the Vienna application if the route is invalid.

## Create components
Vienna is based on the concept of components. One is able to create various components. All of these hold their own logic, their own styling and so on. A component is able to use other components.

To create a component in Vienna, you need the `VComponent` decorator. A component holds three properties: a selector (that needs to consist of two parts, separated by a dash), some styles, and html. For instance:

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

# Todo

- Add renderer cache to increase rendering performance (e.g. use render event for one component + internal component id instead of all)
- Add unit tests
- Work with global styling somehow (e.g. Constructable Stylesheet Objects, see https://wicg.github.io/construct-stylesheets/)
- Use Rollup instead of Webpack since it generates a much smaller bundle size

# Known issues

- VProp is leaking state when routing to subcomponent that has input binding
- VInit does not work without callback yet

# Ideas

- Support optional dark mode (css variables)

# Literature

- https://www.thinktecture.com/en/web-components/flaws/
- https://hackernoon.com/how-to-create-new-template-engine-using-javascript-8f26313p
- https://www.raresportan.com/object-change-detection/ (using Proxy)
- https://fatfreeframework.com/3.7/views-and-templates (nice example of directive syntax)
