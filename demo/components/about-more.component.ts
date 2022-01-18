import {VActivatedRoute, VComponent, VInit} from "../../src";

@VComponent({
    selector: 'app-about-more',
    styles: [],
    html: 'Vienna is based on concepts of Angular and FatFree {{ routeParam }}'
})
export class AboutMoreComponent implements VInit {

    routeParam = '';

    constructor(private activatedRoute: VActivatedRoute) {}

    vInit(): void {
        this.activatedRoute.params(p => {
            this.routeParam = `and ${p.find(v => v.id === 'name').value}`;
        });
    }


}
