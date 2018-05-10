// import '@polymer/polymer/polymer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
`<debug-grid>` is a helper component displaying grid axis for debug purpose.

Example:

    <debug-grid cell-height="70" cell-width="70" cell-margin="10" col-count="20" row-count="20"></debug-grid>
*/
class DebugGrid extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                position: absolute;
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
            }

            #container {
                position: relative;
            }

            .legend {
                position: absolute;
                color: #bfbfbf;
                font-family: Arial;
            }

            .vertical-legend {
                padding-top: 5px;
                margin-left: -7px;
            }

            .horizontal-legend {
                margin-top: -2px;
                padding-left: 5px;
            }

            .axis {
                position: absolute;
                /*z-index: -1;*/
            }

            .vertical-axis {
                border-left: 1px solid #bfbfbf;
            }

            .horizontal-axis {
                border-top: 1px solid #bfbfbf;
            }

            .vertical-axis.center-axis {
                border-left-style: dashed;
            }

            .horizontal-axis.center-axis {
                border-top-style: dashed;
            }

            .margin-axis, .center-axis {
                /*z-index: -2;*/
                border-color: #eaeaea;
            }
        </style>

        <div id="container">
            <dom-repeat items="[[verticalAxes]]">
                <template>
                    <div class="axis vertical-axis margin-axis" style\$="[[_computeAxisStyle('vertical', index, negativeOffset, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <div class="axis vertical-axis" style\$="[[_computeAxisStyle('vertical', index, 0, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <div class="axis vertical-axis margin-axis" style\$="[[_computeAxisStyle('vertical', index, positiveOffset, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <div class="axis vertical-axis center-axis" style\$="[[_computeAxisStyle('vertical', index, verticalCenterOffset, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <span class="legend vertical-legend" style\$="[[_computeLegendStyle('vertical', index, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]">[[_computeLegendValue(index, cellWidth, cellMargin)]]</span>
                </template>
            </dom-repeat>
            <dom-repeat items="[[horizontalAxes]]">
                <template>
                    <div class="axis horizontal-axis margin-axis" style\$="[[_computeAxisStyle('horizontal', index, negativeOffset, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <div class="axis horizontal-axis" style\$="[[_computeAxisStyle('horizontal', index, 0, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <div class="axis horizontal-axis margin-axis" style\$="[[_computeAxisStyle('horizontal', index, positiveOffset, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <div class="axis horizontal-axis center-axis" style\$="[[_computeAxisStyle('horizontal', index, horizontalCenterOffset, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]"></div>
                    <span class="legend horizontal-legend" style\$="[[_computeLegendStyle('horizontal', index, cellWidth, cellHeight, cellMargin, rowCount, colCount)]]">[[_computeLegendValue(index, cellHeight, cellMargin)]]</span>
                </template>
            </dom-repeat>
        </div>
`;
  }

  static get is() { return 'debug-grid'; }

  static get properties() {
      return {
          cellHeight: {
              type: Number,
              value: 100,
              reflectToAttribute: true,
              observer: 'computeOffsets'
          },
          cellWidth: {
              type: Number,
              value: 100,
              reflectToAttribute: true,
              observer: 'computeOffsets'
          },
          cellMargin: {
              type: Number,
              value: 0,
              reflectToAttribute: true,
              observer: 'computeOffsets'
          },
          rowCount: {
              type: Number,
              value: 10,
              reflectToAttribute: true,
              observer: 'rowCountChanged'
          },
          colCount: {
              type: Number,
              value: 10,
              reflectToAttribute: true,
              observer: 'colCountChanged'
          }
      }
  }

  constructor() {
      super();
  }

  _computeAxisStyle(direction, index, offset, width, height, margin, rowCount, colCount) {
      let positionValue, positionProp,
          size, heightValue, widthValue,
          lastIndex;

      if (direction === 'vertical') {
          positionProp = 'left';
          size = width;
          heightValue = height * rowCount + (rowCount - 1) * margin;
          widthValue = 1;
          lastIndex = colCount;
      } else {
          positionProp = 'top';
          size = height;
          heightValue = 1;
          widthValue = width * colCount + (colCount - 1) * margin;
          lastIndex = rowCount;
      }

      // First axis (but center axis)
      if (index === 0 && this.horizontalCenterOffset !== offset && this.verticalCenterOffset !== offset) {
          positionValue = 0;
      // Last axis
      } else if (index === lastIndex) {
          positionValue = index * size + (index - 1) * margin;
      } else {
          positionValue = index * size + (index - 1) * margin + margin / 2 + offset;
      }

      return `${positionProp}:${positionValue}px; width:${widthValue}px; height:${heightValue}px`;
  }

  _computeLegendStyle(direction, index, width, height, margin, rowCount, colCount) {
      let leftValue, topValue;

      if (direction === 'vertical') {
          leftValue = index * width + (index - 1) * margin;
          topValue = rowCount * height + (rowCount - 1) * margin;
      } else {
          leftValue = colCount * width + (colCount - 1) * margin;
          topValue = index * height + (index - 1) * margin;
      }

      return `top:${topValue}px; left:${leftValue}px;`;
  }

  _computeLegendValue(index, size, margin) {
      return index * size + (index > 0 ? (index - 1) * margin + margin / 2 : 0);
  }

  computeOffsets() {
      this.positiveOffset = this.cellMargin / 2;
      this.negativeOffset = -this.positiveOffset;
      this.verticalCenterOffset = this.positiveOffset + this.cellWidth / 2;
      this.horizontalCenterOffset = this.positiveOffset + this.cellHeight / 2;
  }

  rowCountChanged(count) {
      this.horizontalAxes = Array.from({length: count + 1});
  }

  colCountChanged(count) {
      this.verticalAxes = Array.from({length: count + 1});
  }
}

customElements.define(DebugGrid.is, DebugGrid);
