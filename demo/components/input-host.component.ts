import {VComponent, VProp} from "../../src";

@VComponent({
    selector: 'input-host-component',
    styles: [],
    html: `
        <v-repeat let="{{ i }}" for="{{ items }}">
            <span>{{ i }}</span>
            <br />
        </v-repeat>
    `
})
export class InputHostComponent {
    @VProp() items: any[] = []
}