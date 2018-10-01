### artofmo

Recommended start here: [artofmo-examples](https://github.com/maxhudson/artofmo-examples)

#### WARNING
This package is very rough and in early stages - do not expect stability.

I'll be versioning it, so you can avoid breaking scripts that work by putting them in versioned folders with the correct version of node installed.

If you have questions, DM me on instagram [@artofmo](https://instagram.com/artofmo).

#### Very rough instructions (temporary and will improve soon)

Currently I'm using this package by:
1. Creating a single html file (like `main.html`)
1. Creating a javascript file for each drawing I do (like `drawing1.js`)
1. Installing the package in that directory (`npm install artofmo`)
1. Running a local server in the directory those files live in ([Webserver for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en))
1. Visiting a url like `http://localhost:8887/main.html?file=drawing1`

My directory ends up looking like:

- `mo-v0-0-5`
  - `main.html`
  - `drawing1.js`
  - `artofmo` - the node package, versioned according to parent folder
  - `assets` - images and whatnot

You don't need to separate main.html from drawing1.js, but it makes it a lot easier to create many drawings without duplicating the boilerplate html.

##### `main.html`

```html
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
    <script src="./artofmo/dist/index.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
    <script type="module">
      let searchParams = new URLSearchParams(window.location.search);
      let file = searchParams.get('file');

      import(`./${file}.js`).then(module => {
        var {run} = module.default;

        run();
      });
    </script>
  </head>
  <body>
    <div id="mo-container">

    </div>
  </body>
</html>
```

##### `drawing1.js`

```javascript
var run = () => {
  mo.colors.fetch({samples: [[58, 119, 108]], count: 5}).then(colors => {
    mo.ui.init.basic({
      backgroundColor: '#000',
      containerId: 'mo-container',
      size: mo.lib.canvasSizeFor({dpi: 300, inches: {width: 11 - 6/8, height: 17 - 6/8}, retina: true}),
      overlay: false,
    }).then(({rand, render, canvasView, size}) => {
      var offset = {x: -size.width / 2, y: -size.height / 2};
      var diameter = 12;
      var rows = size.height / diameter;
      var columns = size.width / diameter;
      var radius = diameter / 2;
      var circles = {offset, rows, columns, diameter, size: {width: diameter, height: diameter}};

      _.times(circles.rows, row => {
        _.times(circles.columns, column => {
          var circle = {
            x: _.floor(offset.x + column * diameter + radius),
            y: _.floor(offset.y + row * diameter + radius),
            diameter: diameter + 0.5 - diameter / 8 - rand() * diameter / 2,
            color: _.sample(customColors || colors)
          };

          circle.radius = circle.diameter / 2;

          if (circle.radius % 2 === 0) circle.radius -= 1;

          circle.object = new mo.FabricCanvasObject({
            origin: {x: 'center', y: 'center'},
            shape: 'circle',
            position: circle,
            radius: circle.radius,
            zIndex: 1,
            stroke: circle.color,
            fill: circle.color,
            strokeWidth: 0
          });

          canvasView.add(circle);
        });
      });

      render();
    });
  });
};

export default {run};
```

### TODO
- Vector output
- Source map
- Tests
- Reduce output file size https://webpack.js.org/guides/code-splitting/
- Docs
- Support extending so that specialized code can be opted into
- Examples
- Demo
- Actually use babel
