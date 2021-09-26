import {VComponentEncapsulationMode} from "./v-component-encapsulation";

export interface VComponentOptions {
	selector: string;
	styles: string[];
	html: string;
	encapsulationMode?: VComponentEncapsulationMode;
}
