// import '../node_modules/@polymer/polymer/polymer.js';
import '../the-grid.js';
import '../debug-grid.js';
import './grid-styles.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
`<grid-wrapper>` is a container element that wraps <the-grid> for testing purpose and ensure its proper behavior when nested.

Example:

    <grid-wrapper></grid-wrapper>
*/
class GridWrapper extends PolymerElement {
  static get template() {
    return html`
        <style include="grid-styles">
            :host {
                display: block;
            }
        </style>

        <div id="container">
            <debug-grid cell-height="{{cellHeight}}" cell-width="{{cellWidth}}" cell-margin="{{cellMargin}}" col-count="{{colCount}}" row-count="{{rowCount}}"></debug-grid>
            <the-grid cell-height="{{cellHeight}}" cell-width="{{cellWidth}}" cell-margin="{{cellMargin}}" col-count="{{colCount}}" row-count="{{rowCount}}" overlappable="" col-autogrow="" row-autogrow="" draggable="" resizable="" animated="">
                <dom-repeat items="{{boxes}}">
                    <template>
                        <tile col\$="{{item.col}}" row\$="{{item.row}}" height\$="{{item.height}}" width\$="{{item.width}}">
                            <span>{{item.title}}</span>
                            <span resize="left">│</span>
                            <span resize="right">│</span>
                            <span resize="top">─</span>
                            <span resize="bottom">─</span>
                            <span resize="top-right">┐</span>
                            <span resize="top-left">┌</span>
                            <span resize="bottom-right">┘</span>
                            <span resize="bottom-left">└</span>
                        </tile>
                    </template>
                </dom-repeat>
                <div placeholder=""></div>
            </the-grid>
        </div>
`;
  }

  static get is() { return 'grid-wrapper'; }

  static get properties() {
      return {
          boxes: {
              type: Array,
              value: function () {
                  return [
                      {title: '0', col: 0, row: 0, width: 1, height: 1},
                      {title: '1', col: 2, row: 0, width: 1, height: 1},
                      {title: '2', col: 2, row: 2, width: 1, height: 4},
                      {title: '3', col: 3, row: 2, width: 1, height: 1},
                      {title: '4', col: 5, row: 1, width: 2, height: 2},
                      {title: '5', col: 0, row: 1, width: 2, height: 2},
                      {title: '6', col: 0, row: 3, width: 1, height: 1},
                      {title: '7', col: 0, row: 5, width: 2, height: 2},
                      {title: '8', col: 5, row: 4, width: 1, height: 1},
                  ];
              }
          },
          cellWidth: {
              type: Number,
              value: 100
          },
          cellHeight: {
              type: Number,
              value: 100
          },
          cellMargin: {
              type: Number,
              value: 10
          },
          rowCount: {
              type: Number,
              value: 10
          },
          colCount: {
              type: Number,
              value: 10
          }
      }
  }

  constructor() {
      super();
  }
}

customElements.define(GridWrapper.is, GridWrapper);
