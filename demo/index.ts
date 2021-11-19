import {VApplication, VRouteNotFoundStrategy} from '../src';
import {DashboardComponent} from './components/dashboard.component';
import {HomeComponent} from './components/home.component';
import {FooterComponent} from "./components/footer.component";
import {NavbarComponent} from "./components/navbar.component";
import {PersonalComponent} from "./components/personal.component";
import {AboutComponent} from "./components/about.component";
import {CanActivatePersonalGuard} from "./guards/can-activate-personal.guard";
import {SettingsComponent} from "./components/settings.component";

@VApplication({
    declarations: [
        AboutComponent,
        DashboardComponent,
        FooterComponent,
        HomeComponent,
        NavbarComponent,
        PersonalComponent,
        SettingsComponent
    ],
    routes: [
        {path: '/', component: HomeComponent},
        {path: '/about', component: AboutComponent},
        {
            path: '/settings',
            component: SettingsComponent,
            data: {footerText: 'Footer text from route data'}
        },
        {
            path: '/personal',
            component: PersonalComponent,
            data: {authorizedForRole: 'user'},
            guards: [CanActivatePersonalGuard]
        },
    ],
    routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT,
    rootElementSelector: '#vienna-root'
})
export class DemoApplication {
}

// Run the application
new DemoApplication();
