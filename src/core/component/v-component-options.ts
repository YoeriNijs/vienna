import {VComponentEncapsulationMode} from './v-component-encapsulation';

export interface VComponentOptions {
	selector: string;
	styles?: string[];
	style?: string;
	html: string;
	encapsulationMode?: VComponentEncapsulationMode;
	darkModeClassOverride?: string;
}
