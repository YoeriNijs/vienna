import {VApplication, VRouteNotFoundStrategy} from '../src';
import {DashboardComponent} from './components/dashboard.component';
import {HomeComponent} from './components/home.component';
import {FooterComponent} from "./components/footer.component";
import {NavbarComponent} from "./components/navbar.component";
import {PersonalComponent} from "./components/personal.component";
import {AboutComponent} from "./components/about.component";
import {CanActivatePersonalGuard} from "./guards/can-activate-personal.guard";
import {SettingsComponent} from "./components/settings.component";
import {CounterComponent} from "./components/counter.component";
import {AboutMoreComponent} from "./components/about-more.component";
import {DarkModeComponent} from "./components/dark-mode.component";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VApplication({
    declarations: [
        AboutComponent,
        AboutMoreComponent,
        DarkModeComponent,
        DashboardComponent,
        FooterComponent,
        HomeComponent,
        NavbarComponent,
        PersonalComponent,
        SettingsComponent,
        CounterComponent
    ],
    routes: [
        { path: '/', component: HomeComponent },
        { path: '/dark-mode', component: DarkModeComponent },
        {
            path: '/about',
            component: AboutComponent,
            children: [
                { path: '/more', component: AboutMoreComponent },
                { path: '/:name', component: AboutMoreComponent }
            ]
        },
        { path: '/counter', component: CounterComponent },
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
        }
    ],
    routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT,
    rootElementSelector: '#vienna-root',
    plugins: {
        logger: {
            process: logs => console.log('send to logging provider such as Sentry...', logs)
        }
    }
})
export class DemoApplication {
}

// Run the application
new DemoApplication();
