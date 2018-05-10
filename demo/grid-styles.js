// import '../node_modules/@polymer/polymer/polymer.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="grid-styles">
    <template>
        <style>
            the-grid tile {
                background: tomato;
                opacity: 0.8;
                color: white;
                cursor: move;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            the-grid [placeholder] {
                background: #afafaf;
            }

            the-grid tile > span:not([resize]) {
                flex: 1;
                text-align: center;
                font-size: 2em;
            }

            the-grid [resize] {
                position: absolute;
            }

            the-grid [resize="bottom-right"] {
                bottom: 0;
                right: 0;
                cursor: nwse-resize;
            }

            the-grid [resize="bottom-left"] {
                bottom: 0;
                left: 0;
                cursor: nesw-resize;
            }

            the-grid [resize="top-right"] {
                top: 0;
                right: 0;
                cursor: nesw-resize;
            }

            the-grid [resize="top-left"] {
                top: 0;
                left: 0;
                cursor: nwse-resize;
            }

            the-grid [resize="left"] {
                top: 50%;
                left: 0;
                cursor: ew-resize;
                margin-top: -10px;
            }

            the-grid [resize="top"] {
                top: 0%;
                width: 100%;
                text-align: center;
                cursor: ns-resize;
            }

            the-grid [resize="right"] {
                top: 50%;
                right: 0;
                cursor: ew-resize;
                margin-top: -10px;
            }

            the-grid [resize="bottom"] {
                bottom: 0;
                width: 100%;
                text-align: center;
                cursor: ns-resize;
            }

            dom-repeat {
                display: none;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
