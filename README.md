# Vienna (very alpha, still in development)

## Because small code is also nice

Vienna is a small framework under active development and, for me, just a way to discover how frameworks like Angular
actually work under the hood. Vienna is based on some core fundamentals of Angular.

This is just one big WIP. Please, forgive my ugly code, lack of unit tests and documentation, and so on.

See demo app to see how the framework works.

# Todo

- Implement input bindings from component variable
- Implement change detection inside component
- Add unit tests
- Work with global styling somehow (e.g. Constructable Stylesheet Objects, see https://wicg.github.io/construct-stylesheets/)
- Support query params
- Fix direct route bug
  
# Literature
- https://www.thinktecture.com/en/web-components/flaws/
- https://hackernoon.com/how-to-create-new-template-engine-using-javascript-8f26313p
- https://www.raresportan.com/object-change-detection/ (using Proxy)
- https://fatfreeframework.com/3.7/views-and-templates (nice example of directive syntax)
