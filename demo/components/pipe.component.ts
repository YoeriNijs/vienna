import {VComponent} from "../../src";

@VComponent({
    selector: 'pipe-component',
    styles: [
        `
            .container {
                background-color: red;
                padding: 8px;
                display: flex;
                justify-content: columns;
            }
            
            p {
                margin-bottom: 8px;
            }
        `
    ],
    html: `{{ html }}`
})
export class PipeComponent {
    html = `
        <div class="container">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu augue ut lectus arcu bibendum at varius. Vitae nunc sed velit dignissim sodales ut eu sem. Varius sit amet mattis vulputate enim nulla aliquet porttitor lacus. Id eu nisl nunc mi ipsum faucibus. Iaculis at erat pellentesque adipiscing commodo. Ut venenatis tellus in metus vulputate. Venenatis cras sed felis eget velit. Lacinia quis vel eros donec ac odio tempor orci. Non pulvinar neque laoreet suspendisse interdum.</p>
            <p>Nisl suscipit adipiscing bibendum est ultricies. Cras pulvinar mattis nunc sed blandit libero volutpat sed cras. Sed libero enim sed faucibus turpis in eu. Duis convallis convallis tellus id interdum velit laoreet id. Et malesuada fames ac turpis egestas sed tempus. In vitae turpis massa sed elementum. Sit amet consectetur adipiscing elit duis tristique. Aliquam sem fringilla ut morbi tincidunt augue interdum velit. Pharetra et ultrices neque ornare aenean euismod elementum nisi. Dictumst vestibulum rhoncus est pellentesque elit. Risus ultricies tristique nulla aliquet enim tortor at. Risus nullam eget felis eget nunc lobortis mattis aliquam faucibus. Massa placerat duis ultricies lacus. Tellus at urna condimentum mattis pellentesque id nibh. Erat velit scelerisque in dictum non consectetur a erat nam. Egestas egestas fringilla phasellus faucibus scelerisque eleifend.</p>
        </div>
    `;
}