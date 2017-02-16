# \<draggable-grid\>

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vpusher/draggable-grid)

Grid custom element based on **ES6** and **Polymer 2.0**.

This aims to act as a project sample taking advantage of native [Shadow DOM v1](https://developers.google.com/web/fundamentals/primers/shadowdom/)
and [Custom Elements v1](https://developers.google.com/web/fundamentals/primers/customelements/) APIs.

Features:

* Drag and drop tiles
* Resize tiles

Example:
<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="draggable-grid.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<draggable-grid></draggable-grid>
```

Screenshot:

![draggable-grid](images/screenshot.png)

## Installation

First, make sure you have [Bower](https://bower.io/) and the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.

Then,

```
bower install
polymer serve -o
```

## Usage

Add a `<draggable-grid>` element to your page:

```
<draggable-grid></draggable-grid>
```

> This will show a grid layout.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

* **1.0.0:** initial release.

## License

MIT license
