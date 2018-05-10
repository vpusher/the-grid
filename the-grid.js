// import '@polymer/polymer/polymer.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { addListener, removeListener } from '@polymer/polymer/lib/utils/gestures.js';
import { useShadow } from '@polymer/polymer/lib/utils/settings.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
/**
`<the-grid>` is a grid layout element width drag n drop and resize capabilities.

Example:

    <the-grid cell-height="150" cell-width="150" cell-margin="10"></the-grid>

@demo demo/index.html Demos
@demo demo/playground.html Playground
@demo demo/responsive.html Responsiveness
*/
class TheGrid extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: inline-block;
                --grid-width: 1090px;  /* cellWidth * colCount + cellMargin * (colCount - 1) */
                --grid-height: 1090px; /* cellHeight * rowCount + cellMargin * (rowCount - 1) */
                --grid-cell-height: 100px;
                --grid-cell-width: 100px;
                --grid-cell-margin: 10px;
                --grid-move-animation-transition: 'none';
                --grid-resize-animation-transition: 'none';
            }

            #container {
                position: relative;
                width: var(--grid-width);
                height: var(--grid-height);
            }

            #container > ::slotted(*) {
                display: block;
                position: absolute;
                transition: var(--grid-move-animation-transition);
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
            }

            #container > ::slotted([placeholder]) {
                display: none;
                transition: none;
            }

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

        <div id="container">
            <slot></slot>
        </div>
`;
  }

  static get is() { return 'the-grid'; }

  static get properties() {
      return {
          /**
           * Defines the height in pixels of the grid unit.
           * @type {number}
           */
          cellHeight: {
              type: Number,
              value: 100,
              reflectToAttribute: true,
              observer: 'computeStyles'
          },

          /**
           * Defines the width in pixels of the grid unit.
           * @type {number}
           */
          cellWidth: {
              type: Number,
              value: 100,
              reflectToAttribute: true,
              observer: 'computeStyles'
          },

          /**
           * Defines the margin in pixels between grid units.
           * @type {number}
           */
          cellMargin: {
              type: Number,
              value: 0,
              reflectToAttribute: true,
              observer: 'computeStyles'
          },

          minWidth: {
              type: Number,
              value: 1,
              reflectToAttribute: true
          },

          maxWidth: {
              type: Number,
              value: Infinity,
              reflectToAttribute: true
          },

          minHeight: {
              type: Number,
              value: 1,
              reflectToAttribute: true
          },

          maxHeight: {
              type: Number,
              value: Infinity,
              reflectToAttribute: true
          },

          /**
           * Defines the number of columns of the grid (its width in grid unit).
           * @type {number}
           */
          colCount: {
              type: Number,
              value: 10,
              reflectToAttribute: true,
              observer: 'computeStyles'
          },

          /**
           * Defines the number of rows of the grid (its height in grid unit).
           * @type {number}
           */
          rowCount: {
              type: Number,
              value: 10,
              reflectToAttribute: true,
              observer: 'computeStyles'
          },

          /**
           * Whether the grid columns count can increase or not (auto expand while dragging).
           * @type {Boolean}
           */
          colAutogrow: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          /**
           * Whether the grid rows count can increase or not (auto expand while dragging).
           * @type {Boolean}
           */
          rowAutogrow: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          /**
           * Whether the moves and resizes are animated or not.
           * @type {boolean}
           */
          animated: {
              type: Boolean,
              value: false,
              reflectToAttribute: true,
              observer: 'computeStyles'
          },

          /**
           * Enable the drag n drop (of the grid's tiles) capability.
           * @type {boolean}
           */
          draggable: {
              type: Boolean,
              value: false,
              reflectToAttribute: true,
              observer: '_upgradeEvents'
          },

          /**
           * Enable the resize (of the grid's tiles) capability.
           * @type {boolean}
           */
          resizable: {
              type: Boolean,
              value: false,
              reflectToAttribute: true,
              observer: '_upgradeEvents'
          },

          /**
           * Allow tiles to overlap each other.
           * @type {boolean}
           */
          overlappable: {
              type: Boolean,
              value: false,
              reflectToAttribute: true,
          }
      }
  }

  /**
   * Create a `<the-grid>` element.
   */
  constructor() {
      super();

      // Create the mutation observer instance.
      const observer = new MutationObserver(mutations => 
        mutations.forEach(mutation => this._upgradeEvents(mutation)));

      // Configuration of the observer: only listen for children changes.
      const config = { childList: true };

      // The observed target is the grid element itself.
      observer.observe(this, config);
  }

  connectedCallback () {
      super.connectedCallback();
      this.computeStyles();
  }

  /**
   * Handle event attachment when a mutation occurs. If call without any mutation update all current tiles/children.
   * @param {MutationRecord} [record] Mutation record holding the added or removed nodes.
   * @private
   */
  _upgradeEvents(record) {
      // Only update given nodes from the mutation.
      if (record instanceof MutationRecord) {
          Array.from(record.addedNodes).forEach(node => {
              if (node instanceof HTMLElement) {
                  this._toggleEvents(node, false);
              }
          });
          Array.from(record.removedNodes).forEach(node => {
              if (node instanceof HTMLElement) {
                  this._toggleEvents(node, true);
              }
          });
      // Update all nodes (no arg).
      } else {
          Array.from(this.children).forEach(child => {
              this._toggleEvents(child, false);
          });
      }
  }

  /**
   * Adds and removes tracking events depending on the `resizable` and `draggable` properties.
   * @param {HTMLElement} node Node to add/remove listener on.
   * @param {Boolean} removed Whether the node has been removed or added.
   * @private
   */
  _toggleEvents(node, removed) {
      const moveHandler = this._handleMoveFn = this._handleMoveFn || this._handleMove.bind(this);
      const resizeHandler = this._handleResizeFn = this._handleResizeFn || this._handleResize.bind(this);

      const addOrRemoveResizeListener = this.resizable && !removed;
      const addOrRemoveMoveListener = this.draggable && !removed;
      const addOrRemoveNativeListener = !removed;

      const  isPlaceholder = node.hasAttribute('placeholder');

      if (isPlaceholder && !removed) {
          this.placeholder = node;
      } else {
          const resizers = node.querySelectorAll('[resize]') || [];

          Array.from(resizers).forEach(resizer => {
              if (addOrRemoveResizeListener && !resizer._hasResizeListener) {
                  addListener(resizer, 'track', resizeHandler);
                  resizer._hasResizeListener = true;
              } else if (!addOrRemoveResizeListener) {
                  removeListener(resizer, 'track', resizeHandler);
                  resizer._hasResizeListener = false;
              }
          });

          if (addOrRemoveMoveListener && !node._hasMoveListener) {
              addListener(node, 'track', moveHandler);
              node._hasMoveListener = true;
          } else if (!addOrRemoveMoveListener) {
              removeListener(node, 'track', moveHandler);
              node._hasMoveListener = false;
          }

          // We need this dirty prevent default since 'track' gestures
          // - let pass some events before triggering the 'start' state.
          // - does not allow access to the real source event on touch devices.
          if (addOrRemoveNativeListener && !node._hasNativeMoveListener) {
              node.addEventListener('touchmove', this._safePreventDefault);
              node._hasNativeMoveListener = true;
          } else if (!addOrRemoveNativeListener) {
              node.removeEventListener('touchmove', this._safePreventDefault);
              node._hasNativeMoveListener = false;
          }
      }
  }

  /**
   * Compute the style sheet of the grid depending on its attributes/properties.
   *
   * It allows hot update of the grid attributes/properties, generating an updated style sheet.
   *
   * IMPORTANT: If you have several `<the-grid>` in your page, be sure to give them a proper `id` attribute, so they can have their own style sheet without any collision.
   */
  computeStyles() {

      const idSelector = this.id ? `#${this.id}` : '';
      const selfSelector = `the-grid${idSelector}`;
      const startSelector = useShadow ? '#container > ::slotted(' : `${selfSelector} `;
      const endSelector = useShadow ? ')' : '';
      const customStyle = this._customStyle || document.createElement('custom-style');
      const style = customStyle && customStyle.querySelector('style') || document.createElement('style');

      let margin = this.cellMargin,
          height = this.cellHeight,
          width = this.cellWidth,
          cols = this.colCount,
          rows = this.rowCount;

      // Always fallback on [1 x 1] tiles if size is out of boundaries.
      let styleRules = `
              ${startSelector}[width]${endSelector}  { width:  var(--grid-width-1);  }
              ${startSelector}[height]${endSelector} { height: var(--grid-height-1); }
      `;

      let styleVars = {
          '--grid-width': `${width * cols + margin * (cols - 1)}px`,
          '--grid-height': `${height * rows + margin * (rows - 1)}px`,
          '--grid-cell-width': `${this.cellWidth}px`,
          '--grid-cell-height': `${this.cellHeight}px`,
          '--grid-cell-margin': `${this.cellMargin}px`,
          '--grid-move-animation-transition': `${this.animated ? 'top 0.5s ease, left 0.5s ease' : 'none'}`,
          '--grid-resize-animation-transition': `${this.animated ? 'top 0.5s ease, left 0.5s ease, width 0.5s ease, height 0.5s ease' : 'none'}`
      };

      for(let i = 0; i < cols; i++) {

          styleVars[`--grid-col-${i}`]       = `${i * width  + i * margin}px`;
          styleVars[`--grid-width-${i + 1}`] = `${(i + 1) * width  + i * margin}px`;

          styleRules += `
              ${startSelector}[col="${i}"]${endSelector}          { left:  var(--grid-col-${i}); }
              ${startSelector}[width="${i + 1}"]${endSelector}    { width: var(--grid-width-${(i + 1)}); }
          `;
      }

      for(let i = 0; i < rows; i++) {

          styleVars[`--grid-row-${i}`]        = `${i * height  + i * margin}px`;
          styleVars[`--grid-height-${i + 1}`] = `${(i + 1) * height  + i * margin}px`;

          styleRules += `
              ${startSelector}[row="${i}"]${endSelector}        { top:     var(--grid-row-${i}); }
              ${startSelector}[height="${i + 1}"]${endSelector} { height:  var(--grid-height-${(i + 1)}); }
          `;
      }

      style.textContent = styleRules;

      this._customStyle = customStyle;

      // Light Dom customization using external stylesheet.
      customStyle.appendChild(style);
      this.root.appendChild(customStyle);
      // Local DOM (Shadow or Shady) customization using inner stylesheet.
      this.updateStyles(styleVars);

  }

  /**
   * Increase the grid size if the given tile is out of grid bounds.
   * @param {HTMLElement} tile Tile to fit in the grid bounds.
   */
  ensureSpace(tile) {
      if(this.rowAutogrow) {
          this.rowCount = Math.max(this.rowCount, +tile.getAttribute("row") + +tile.getAttribute("height"));
      }
      if(this.colAutogrow ) {
          this.colCount = Math.max(this.colCount, +tile.getAttribute("col") + +tile.getAttribute("width"));
      }
  }

  /**
   * Process events related to a player being moved.
   * @private
   * @fires TheGrid#move
   */
  _handleMove(e) {
      let player = e.target,
          state = e.detail.state;

      // Only handle direct children of the grid.
      if (dom(player).parentNode !== this) return;

      // Create a placeholder if not present.
      if (!this.placeholder) {
          this.placeholder = document.createElement('div');
      }

      if (state == 'start') {
          let styles = window.getComputedStyle(player);
          player.style.left = styles.getPropertyValue('left');
          player.style.top = styles.getPropertyValue('top');
          player.style.transition = 'none';
          player.style.zIndex = 1;
          this.placeholder.setAttribute('width', player.getAttribute('width'));
          this.placeholder.setAttribute('height', player.getAttribute('height'));
          this.placeholder.setAttribute('row', player.getAttribute('row'));
          this.placeholder.setAttribute('col', player.getAttribute('col'));
          this.placeholder.style.display = 'block';
      }

      if (state == 'track') {
          let left = parseFloat(player.style.left.split('px')[0]);
          let top = parseFloat(player.style.top.split('px')[0]);
          let newLeft = left + e.detail.ddx;
          let newTop = top + e.detail.ddy;
          let cols = +player.getAttribute('width');
          let rows = +player.getAttribute('height');
          let position = this.getClosestPosition(newLeft, newTop, rows, cols);
          player.style.transition = 'none';
          player.style.left = `${newLeft}px`;
          player.style.top = `${newTop}px`;

          // Check for overlaps if enabled.
          if (this.overlappable || !this._isOverlapping(position.col, position.row, cols, rows, [player])) {
              this.placeholder.setAttribute('row', position.row);
              this.placeholder.setAttribute('col', position.col);
              this.ensureSpace(this.placeholder);
          }
      }

      if (state == 'end') {
          player.setAttribute('row', this.placeholder.getAttribute('row'));
          player.setAttribute('col', this.placeholder.getAttribute('col'));
          player.style.left = '';
          player.style.top = '';
          player.style.transition = '';
          player.style.zIndex = '';
          this.placeholder.style.display = '';

          /**
           * `move` event when tile is dropped.
           *
           * @event TheGrid#move
           * @type {object}
           * @property {HTMLElement} grid - The grid in which the event occurred.
           * @property {HTMLElement} tile - The tile that has been moved.
           */
          player.dispatchEvent(new CustomEvent('move', {
              bubbles: true,
              composed: true,
              detail: {
                  grid: this,
                  tile: player
              }
          }));
      }

      this._safePreventDefault(e.detail.sourceEvent);
      e.preventDefault();
      e.stopPropagation();

  }

  /**
   * Process events related to a player being resized.
   * @private
   * @fires TheGrid#resize
   */
  _handleResize(e) {
      let player = this.getResizerHost(e.target),
          state = e.detail.state,
          resizeType = e.target.getAttribute('resize'),
          isTop = ['top', 'top-right', 'top-left'].includes(resizeType),
          isLeft = ['left', 'top-left', 'bottom-left'].includes(resizeType),
          isWidth = ['left', 'right', 'bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(resizeType),
          isHeight = ['top', 'bottom', 'top-right', 'bottom-right',  'bottom-left', 'top-left'].includes(resizeType);

      // Create a placeholder if not present.
      if (!this.placeholder) {
          this.placeholder = document.createElement('div');
      }

      if (state == 'start') {
          let styles = window.getComputedStyle(player);
          player.style.left = styles.getPropertyValue('left');
          player.style.top = styles.getPropertyValue('top');
          player.style.width = styles.getPropertyValue('width');
          player.style.height = styles.getPropertyValue('height');
          player.style.transition = 'none';
          player.style.zIndex = 1;
          this.placeholder.setAttribute('width', player.getAttribute('width'));
          this.placeholder.setAttribute('height', player.getAttribute('height'));
          this.placeholder.setAttribute('row', player.getAttribute('row'));
          this.placeholder.setAttribute('col', player.getAttribute('col'));
          this.placeholder.style.display = 'block';
      }

      if (state == 'track') {
          let left = parseFloat(player.style.left.split('px')[0]);
          let top = parseFloat(player.style.top.split('px')[0]);
          let width = parseFloat(player.style.width.split('px')[0]);
          let height = parseFloat(player.style.height.split('px')[0]);
          let newLeft = left + e.detail.ddx;
          let newTop = top + e.detail.ddy;
          let newWidth = width + (isLeft ? -e.detail.ddx : e.detail.ddx);
          let newHeight = height + (isTop ? -e.detail.ddy : e.detail.ddy);
          let row = +player.getAttribute('row');
          let col = +player.getAttribute('col');
          let cols = +player.getAttribute('width');
          let rows = +player.getAttribute('height');
          let position = this.getClosestPosition(newLeft, newTop, 1, 1, isTop || isLeft);
          let size = this.getClosestSize(
              newWidth,
              newHeight,
              isLeft ? cols + col : this.colCount - col,
              isTop ? rows + row : this.rowCount - row
          );
          let minWidth = parseInt(player.getAttribute('min-width')) || this.minWidth;
          let maxWidth = parseInt(player.getAttribute('max-width')) || this.maxWidth;
          let minHeight = parseInt(player.getAttribute('min-height')) || this.minHeight;
          let maxHeight = parseInt(player.getAttribute('max-height')) || this.maxHeight;

          player.style.transition = 'none';
          isLeft && newWidth >= this.cellWidth && (player.style.left = `${newLeft}px`);
          isTop && newHeight >= this.cellHeight && (player.style.top = `${newTop}px`);
          isWidth && newWidth >= this.cellWidth && (player.style.width = `${newWidth}px`);
          isHeight && newHeight >= this.cellHeight && (player.style.height = `${newHeight}px`);

          // Check for overlaps if enabled.
          if (this.overlappable || !this._isOverlapping(position.col, position.row, size.width, size.height, [player])) {
              let isWidthValid = this._isWithinConstraints(size.width, minWidth, maxWidth);
              let isHeightValid = this._isWithinConstraints(size.height, minHeight, maxHeight);
              isTop && isHeightValid && this.placeholder.setAttribute('row', position.row);
              isLeft && isWidthValid && this.placeholder.setAttribute('col', position.col);
              isWidth && isWidthValid && this.placeholder.setAttribute('width', size.width);
              isHeight && isHeightValid && this.placeholder.setAttribute('height', size.height);
              this.ensureSpace(this.placeholder);
          }
      }

      if (state == 'end') {
          player.setAttribute('row', this.placeholder.getAttribute('row'));
          player.setAttribute('col', this.placeholder.getAttribute('col'));
          player.setAttribute('width', this.placeholder.getAttribute('width'));
          player.setAttribute('height', this.placeholder.getAttribute('height'));
          player.style.transition = 'var(--grid-resize-animation-transition)';
          player.style.left = '';
          player.style.top = '';
          player.style.width = '';
          player.style.height = '';
          player.style.zIndex = '';
          setTimeout(() => {
              player.style.transition = '';
          }, 500);

          this.placeholder.style.display = '';

          /**
           * `resize` event when resizer/gripper is dropped.
           *
           * @event TheGrid#resize
           * @type {object}
           * @property {HTMLElement} grid - The grid in which the event occurred.
           * @property {HTMLElement} tile - The tile that has been resized.
           */
          player.dispatchEvent(new CustomEvent('resize', {
              bubbles: true,
              composed: true,
              detail: {
                  grid: this,
                  tile: player
              }
          }));
      }

      this._safePreventDefault(e.detail.sourceEvent);
      e.preventDefault();
      e.stopPropagation();

  }

  /**
   * Check the existence of the #preventDefault method before calling it.
   * @param {Event} event the event to prevent
   * @private
   */
  _safePreventDefault(event) {
      event.preventDefault && event.preventDefault();
  }


  /**
   * Checks for overlaps with other tiles.
   * @param {Number} col
   * @param {Number} row
   * @param {Number} width
   * @param {Number} height
   * @return {Boolean|Element} Returns either `false` if no overlap is found or the overlapping element itself.
   * @private
   */
  _isOverlapping(col, row, width, height, exceptions = []) {
      let overlap = false;

      for (let i = 0; i < this.children.length; i++) {

          let child = this.children[i];

          if (child.hasAttribute('placeholder') || exceptions.indexOf(child) !== -1) {
              continue;
          }

          let childCoords = this.getCoordinates(child);

          if(
              col <= (childCoords.col + childCoords.width - 1) &&
              row <= (childCoords.row + childCoords.height - 1) &&
              (col + width - 1) >= childCoords.col &&
              (row + height - 1) >= childCoords.row
          ) {
              overlap = child;
              break;
          }
      }

      return overlap;

  }
  /**
  * Checks if the given width or height as `value` is within grid constraints.
  * @param {Number} value in grid unit.
  * @param {Number} min in grid unit.
  * @param {Number} max in grid unit.
  * @return {Boolean} true when within constraints, otherwise false.
  * @private
  */
  _isWithinConstraints(value, min = 1, max = Infinity) {
      return value >= min && value <= max;
  }

  /**
   * Extract the position attributes (`row`, `col`) and size attributes (`width`, `height`) of the given tile element.
   * @param {HTMLElement} tile Tile to read attributes from.
   * @returns {{col: number, row: number, width: number, height: number}} The position and size of the given tile as raw object.
   */
  getCoordinates(tile) {
      return {
          row:    +tile.getAttribute('row'),
          col:    +tile.getAttribute('col'),
          width:  +tile.getAttribute('width'),
          height: +tile.getAttribute('height')
      }
  }

  /**
   * Find the closest player position (column and row as indexes) for the given X and Y.
   * @param {number} x position in pixels on X screen axis.
   * @param {number} y position in pixels on Y screen axis.
   * @param {number} [rows=1] indicates the height in grid units of the player being positioned. This ensure the returned position take into account the size of the player.
   * @param {number} [cols=1] indicates the width in grid units of the player being positioned. This ensure the returned position take into account the size of the player.
   * @param {boolean} [floorHalf=false] Tells whether we need to floor or ceil when the value is half (e.g. 1.5, 3.5, 12.5, ...).
   * @returns {{col: number, row: number}} The closest position as an object with a `row` and `col` properties.
   */
  getClosestPosition(x, y, rows = 1, cols = 1, floorHalf = false) {
      let position;
      let colRatio = (x + this.cellMargin / 2) / (this.cellWidth + this.cellMargin);
      let rowRatio = (y + this.cellMargin / 2) / (this.cellHeight + this.cellMargin);

      if (floorHalf) {
          position = {
              // Depending on which resize gripper (direction = top or left, or both) is used,
              // we wants to floor the half distance in the proper direction, to finally fall in the desired cell.
              col : colRatio % 0.5 === 0 ? Math.floor(colRatio) : Math.round(colRatio),
              row : rowRatio % 0.5 === 0 ? Math.floor(rowRatio) : Math.round(rowRatio)
          };
      } else {
          position = {
              col : Math.round(colRatio),
              row : Math.round(rowRatio)
          };
      }

      // Ensure we are falling into the grid.
      // Min = 0.
      // Max = grid size - player size.
      return {
          col: Math.max(Math.min(position.col, this.colAutogrow ? Infinity : this.colCount - cols), 0),
          row: Math.max(Math.min(position.row, this.rowAutogrow ? Infinity : this.rowCount - rows), 0)
      }

  }

  /**
   * Find the closest player size (width and height as grid units) for the given width and height.
   * @param {number} width width in pixels.
   * @param {number} height height in pixels.
   * @param {number} [maxWidth=this.colCount] indicates the max width allowed for the returned size. This ensure the returned size fall into the grid by taking into account the player position.
   * @param {number} [maxHeight=this.rowCount] indicates the max height allowed for the returned size. This ensure the returned size fall into the grid by taking into account the player position.
   * @returns {{width: number, height: number}} The closest size as an object with a `width` and `height` properties.
   */
  getClosestSize(width, height, maxWidth = this.colCount, maxHeight = this.rowCount) {
      let size = {
          height: Math.round((height + this.cellMargin / 2) / (this.cellHeight + this.cellMargin)),
          width:  Math.round((width + this.cellMargin / 2) / (this.cellWidth + this.cellMargin))
      };

      // Ensure we are falling into the grid.
      // Min = 1.
      // Max = grid size (or provided max)
      return {
          width: Math.max(Math.min(size.width, this.colAutogrow ? Infinity : maxWidth), 1),
          height: Math.max(Math.min(size.height, this.rowAutogrow ? Infinity : maxHeight), 1)
      }
  }

  /**
   * Find the tile element (direct children of `the-grid`) hosting the given resizer element.
   * @param {HTMLElement} resizer element used as resizer gripper.
   * @returns {HTMLElement} The tile element hosting the resizer.
   */
  getResizerHost(resizer) {
      var current = resizer;

      while (current.parentNode !== this) {
          current = current.parentNode;
      }

      return current !== this && current !== resizer ? current : undefined;
  }

  /**
   * Output as JSON array the current positions and sizes of all tiles.
   * Represents the serialized state of the grid.
   *
   * @returns {Array<{col: Number, row: Number, width: Number, height: Number}>} Array of tile's coordinates (position and size) objects.
   */
  serialize() {
      return Array.from(this.children).map(child => {
          return {
              col: child.getAttribute("col"),
              row: child.getAttribute("row"),
              width: child.getAttribute("width"),
              height: child.getAttribute("height")
          }
      });
  }
}

customElements.define(TheGrid.is, TheGrid);
