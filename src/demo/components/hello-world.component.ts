import {VComponent} from "../../core/component/v-component";
import {VInit} from "../../core/router/hooks/v-init";

@VComponent({
	selector: 'hello-world',
	styles: [`
		.container {
			background-color: blue;
			padding: 10px;
			border-radius: 8px;
			color: #fff;
			
			a {
				cursor: pointer;
			}
		}
	`],
	html: `
		<div class="container">
			<div class="msg">Welcome in my world</div>
		<div>
<!--		Todo: this does not work (nested nodes do not work either!)-->
<!--		<div data-v-click="navigateBack()"><< back</div>-->
	`
})
export class HelloWorldComponent implements VInit {
	vInit(): void {
		console.log('hello world component');
		setTimeout(() => this.navigateBack(), 2000);
	}

	navigateBack(): void {
		window.history.back();
	}
}
