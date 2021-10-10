import {VApplication, VRouteNotFoundStrategy} from '../core';
import {DashboardComponent} from './components/dashboard.component';
import {HomeComponent} from './components/home.component';
import {FooterComponent} from "./components/footer.component";
import {NavbarComponent} from "./components/navbar.component";
import {PersonalComponent} from "./components/personal.component";

@VApplication({
    declarations: [
        FooterComponent,
        DashboardComponent,
        HomeComponent,
        NavbarComponent,
        PersonalComponent
    ],
    routes: [
        {path: '/', component: HomeComponent},
        {path: '/personal', component: PersonalComponent},
    ],
    routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT,
})
export class DemoApplication {
}
