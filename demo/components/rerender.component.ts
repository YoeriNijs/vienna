import {VActivatedRoute, VComponent, VInit, VProp} from "../../src";

/**
 * This demo app is for <b>development purposes only</b>, needed to test some edge cases.
 * If you want to see a 'real world' example of Vienna, please check https://github.com/YoeriNijs/vienna-demo-app.
 */
interface Tab {
    title: string;
    body: string;
}

@VComponent({
    selector: 'rerender-child-component',
    styles: [
        `
            .active { 
                background-color: red; 
            }
            
            li {
                cursor: pointer;
            }
            
            li:hover:not(.active) {
                background-color: yellow;
            }
        `
    ],
    html: `
        <ul>
            <v-repeat let="{{ t }}" for="{{ tabs }}">
                <v-check if="isActive({{ t.title }})">
                    <true>
                        <a href="#/rerender?tab={{ t.title }}"><li class="active">{{ t.title }}</li></a>
                    </true>
                    <false>
                        <a href="#/rerender?tab={{ t.title }}"><li>{{ t.title }}</li></a>
                    </false>
                </v-check>
            </v-repeat>
        </ul>
        
        <v-check if="hasActive()">
            <true>
                <p>{{ active.body | raw }}</p>
            </true>
        </v-check>
    `
})
export class RerenderChildComponent implements VInit {
    @VProp() tabs: Tab[] = [];

    active: Tab;

    constructor(private activatedRoute: VActivatedRoute) {
    }

    vInit() {
        this.activatedRoute.queryParams(p => {
            const tabTitle = p.tab;
            if (tabTitle) {
                const tab = this.tabs.find(t => t.title === tabTitle);
                if (tab) {
                    this.active = tab;
                    return;
                }
            }
            this.active = this.tabs[0];
        })
    }

    isActive(title: string): boolean {
        return this.active && this.active.title === title;
    }

    setActiveByTitle(title: string): void {
        this.active = this.tabs.find(t => t.title === title);
    }

    hasActive(): boolean {
        return !!this.active;
    }
}

@VComponent({
    selector: 'rerender-parent-component',
    styles: [],
    html: `<rerender-child-component tabs="{{ tabs }}"></rerender-child-component>`
})
export class RerenderParentComponent {

    tabs: Tab[] = [
        {title: 'Tab 1', body: 'Body of tab 1'},
        {title: 'Tab 2', body: `Body of tab 2. <a href="#/rerender?tab=Tab 3">Go to tab 3</a>`},
        {title: 'Tab 3', body: 'Body of tab 3'},
    ];
}