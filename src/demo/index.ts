import {VApplication, VRouteNotFoundStrategy} from '../core';
import {DashboardComponent} from './components/dashboard.component';
import {HomeComponent} from './components/home.component';
import {FooterComponent} from "./components/footer.component";
import {NavbarComponent} from "./components/navbar.component";
import {PersonalComponent} from "./components/personal.component";
import {AboutComponent} from "./components/about.component";
import {CanActivatePersonalGuard} from "./guards/can-activate-personal.guard";

@VApplication({
    declarations: [
        AboutComponent,
        DashboardComponent,
        FooterComponent,
        HomeComponent,
        NavbarComponent,
        PersonalComponent
    ],
    routes: [
        { path: '/', component: HomeComponent },
        { path: '/about', component: AboutComponent },
        {
            path: '/personal',
            component: PersonalComponent,
            data: { authorizedForRole: 'user' },
            canActivate: [CanActivatePersonalGuard]
        },
    ],
    routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT,
})
export class DemoApplication {
}
