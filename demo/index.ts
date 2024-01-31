import {VApplication} from '../src';
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
import {SwitchComponent} from "./components/switch.component";
import {DomParserComponent} from "./components/dom-parser.component";
import {InputComponent} from "./components/input.component";
import {InputHostComponent} from "./components/input-host.component";
import {PipeComponent} from "./components/pipe.component";
import {TemplateComponent} from "./components/template.component";
import {StyleComponent} from "./components/style.component";
import {RerenderChildComponent, RerenderParentComponent} from "./components/rerender.component";
import {CustomPipesComponent} from "./components/custom-pipes.component";
import {GreetingPipe} from "./pipes/greeting.pipe";
import {TranslatePipe} from "./pipes/translate.pipe";
import {I18nComponent} from "./components/i18n.component";
import {determineLanguageSet} from "./i18n/determine_language_set";
import {CounterInCheckComponent} from "./components/counter-in-check.component";
import {StyleInnerComponent} from "./components/style-inner.component";
import {handleRouteNotFound} from "./routing/handle-route-not-found";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
@VApplication({
    declarations: [
        AboutComponent,
        AboutMoreComponent,
        CounterComponent,
        CounterInCheckComponent,
        CustomPipesComponent,
        DarkModeComponent,
        DashboardComponent,
        DomParserComponent,
        FooterComponent,
        HomeComponent,
        I18nComponent,
        InputComponent,
        InputHostComponent,
        NavbarComponent,
        RerenderChildComponent,
        RerenderParentComponent,
        PersonalComponent,
        PipeComponent,
        SettingsComponent,
        StyleComponent,
        StyleInnerComponent,
        SwitchComponent,
        TemplateComponent
    ],
    pipes: [
        GreetingPipe,
        TranslatePipe
    ],
    routes: [
        {path: '/', component: HomeComponent},
        {path: '/switch', component: SwitchComponent},
        {path: '/dark-mode', component: DarkModeComponent},
        {path: '/dom-parser', component: DomParserComponent},
        {path: '/input', component: InputComponent},
        {path: '/pipe', component: PipeComponent},
        {path: '/custom-pipes', component: CustomPipesComponent},
        {path: '/template', component: TemplateComponent},
        {path: '/style', component: StyleComponent},
        {path: '/style-inner', component: StyleInnerComponent},
        {path: '/rerender', component: RerenderParentComponent},
        {path: '/i18n', component: I18nComponent},
        {
            path: '/about',
            component: AboutComponent,
            docTags: {
                title: 'About page title',
                meta: [{name: 'author', content: 'Lucky Luke'}]
            },
            children: [
                {
                    path: '/more',
                    component: AboutMoreComponent
                },
                {path: '/:name', component: AboutMoreComponent}
            ]
        },
        {path: '/counter', component: CounterComponent},
        {path: '/counter-in-check', component: CounterInCheckComponent},
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
    routeNotFoundStrategy: {
        redirectTo: handleRouteNotFound
    },
    rootElementSelector: '#vienna-root',
    plugins: {
        logger: {
            process: logs => console.log('send to logging provider such as Sentry...', logs)
        }
    },
    globalStyles: [
        {
            href: 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
            crossOrigin: 'anonymous',
            integrity: 'sha384-HmYpsz2Aa9Gh3JlkCoh8kUJ2mUKJKTnkyC2Lzt8aLzpPOpnDe8KpFE2xNiBpMDou'
        }
    ],
    i18n: {
        setActiveLanguageSet: determineLanguageSet
    }
})
export class DemoApplication {
}

// Run the application
new DemoApplication();
