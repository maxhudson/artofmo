import _ from 'lodash';
import trig from '../util/trig';

var util = {
  rand(size=1, factor=0) {
    return Math.random() * Math.abs(size) + (factor ? Math.abs(size) * factor : 0);
  },

  randInt(factor) {
    return _.floor(util.rand() * factor);
  },

  randPoint(size, factor) {
    return {
      x: util.rand(_.isObject(size) ? size.x : size, factor),
      y: util.rand(_.isObject(size) ? size.y : size, factor)
    };
  },

  arrayArgsOrVariadicArgsToArray(args, ...variadicArgs) {
    if (!Array.isArray(args)) {
      args = [args, ...variadicArgs];
    }

    return args;
  },

  //sum(1, 2) or sum([1, 2]);
  //sum(1, 2) or sum({a: 1}, {a: 2})
  sum(...args) {
    var values = util.arrayArgsOrVariadicArgsToArray(args);

    if (typeof(values[0]) === 'object') {
      var sum = _.reduce(values, (sum, object) => {
        _.forEach(object, (value, key) => sum[key] = (sum[key] || 0) + value);

        return sum;
      }, {});
    }
    else {
      var sum = _.sum(values);
    }

    return sum;
  },

  difference(...args) {
    var values = util.arrayArgsOrVariadicArgsToArray(args);

    if (typeof(values[0]) === 'object') {
      var sum = _.reduce(values, (sum, object) => {
        _.forEach(object, (value, key) => sum[key] = (sum[key] === undefined ? value : sum[key] - value));

        return sum;
      }, {});
    }
    else {
      values = values.map((value, v) => v === 0 ? value : -value);

      var sum = _.sum(values);
    }

    return sum;
  },

  /**
   * multiply values (numbers or objects or both) by each other to reduce
   * @param  {Array|...<Object|Number|both>} values
   * @return {Object|Number}        Reduced Object
   */
  product(...args) {
    var values = util.arrayArgsOrVariadicArgsToArray(args);
    var hasObjects = _.some(values, value => _.isObject(value));

    return _.reduce(values, (product, value) => {
      if (hasObjects) {
        if (_.isObject(value)) {
          _.forEach(value, (value, key) => {
            if (_.isNil(product[key])) product[key] = 1;

            product[key] *= value;
          });
        }
        else {
          _.forEach(product, (pv, key) => product[key] *= value);
        }
      }
      else {
        product *= value;
      }

      return product;
    }, hasObjects ? {} : 1);
  },

  min(...args) {
    return _.min(util.arrayArgsOrVariadicArgsToArray(args));
  },

  max(...args) {
    return _.max(util.arrayArgsOrVariadicArgsToArray(args));
  },

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

  trig
};

export default util;
