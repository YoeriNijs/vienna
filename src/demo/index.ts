import { VApplication, VRouteNotFoundStrategy } from '../core';
import { HelloWorldComponent } from './components/hello-world.component';
import { MainComponent } from './components/main.component';

@VApplication({
  declarations: [
    MainComponent,
    HelloWorldComponent,
  ],
  routes: [
    { path: '/', component: MainComponent },
    { path: '/hello', component: HelloWorldComponent },
  ],
  routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT,
})
export class DemoApplication {
  constructor() {
    console.log('Initialize demo application...');
  }
}
