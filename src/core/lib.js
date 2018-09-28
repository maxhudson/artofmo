import mathTrig from '../lib/math/trig.js';

var lib = {
  rand: (size=1, factor=0) => Math.random() * Math.abs(size) + (factor ? Math.abs(size) * factor : 0),
  randInt: (factor) => _.floor(mo.rand() * factor),
  getImageData({url, size}) {
    return new Promise((resolve) => {
      FabricCanvasObject.loadImages({image: url}).then(({image}) => {
        var scale = window.devicePixelRatio;
        var downscaledSize = {width: size.width / scale, height: size.height / scale};

        var canvasView = new CanvasView({size: downscaledSize, $container: $('body'), canvasOptions: {backgroundColor: 'transparent'}});
        var canvasContext = canvasView.canvas.getContext('2d');
        var object = new FabricCanvasObject({type: 'image', image, position: {x: 0, y: 0}, size: downscaledSize});

        canvasView.add({object});
        canvasView.render({layout: true});

        var {data} = canvasContext.getImageData(0, 0, size.width, size.height);
        var pixels = {};

        _.times(size.width, x => {
          _.times(size.height, y => {
            var red = (y * size.width + x) * 4;
            var rgba = {r: data[red], g: data[red + 1], b: data[red + 2], a: data[red + 3]};

            pixels[`${x}-${y}`] = new Color(rgba);
          });
        });

        resolve({image, pixels});
      });
    });
  },
  canvasSizeFor({dpi, feet, inches, retina=false}) {
    if (feet) inches = {width: feet.width * 12, height: feet.height * 12};

    var size = {width: inches.width * dpi, height: inches.height * dpi};

    if (retina) size = {width: size.width / 2, height: size.height / 2};

    return size;
  },
  math: {trig: mathTrig}
};

export default lib;
