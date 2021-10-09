import {VComponent, VInit } from "../../core";

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
		<div data-v-click="navigateBack()"><< back</div>
		<main></main>
	`
})
export class HelloWorldComponent implements VInit {
	vInit(): void {
		console.log('hello world component');
	}

	navigateBack(): void {
		window.history.back();
	}
}
