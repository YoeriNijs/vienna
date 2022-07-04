import {VComponent} from "../../src";

@VComponent({
    selector: 'switch-component',
    styles: [],
    html: `
        <v-switch condition="{{ outerName }}">
            <v-case if="Aap">
                Is aap
            </v-case>
            <v-case-default>
                Geen aap
            </v-case-default>
        </v-switch>
        
        <v-switch condition="{{ outerName }}">
            <v-case if="Noot">
                <v-switch condition="{{ innerName }}">
                    <v-case if="Mies">
                        Is mies
                    </v-case>
                    <v-case-default>
                        Geen mies
                    </v-case-default>
                </v-switch>
            </v-case>
            <v-case-default>
                Geen noot
            </v-case-default>
        </v-switch>
    `
})
export class SwitchComponent {
    outerName = 'Noot';
    innerName = 'Mies';
}