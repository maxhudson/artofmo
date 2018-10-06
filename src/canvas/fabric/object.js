import CanvasObject from '../object.js';
import {fabric} from '../../core/fabric.js';
//import {sum} from '../../core/util';

export default class FabricCanvasObject extends CanvasObject {
  constructor(props) {
    super(_.defaults(props, {
      type: 'shape',
      shape: 'rect'
    }));

    if (this.props.type === 'shape') {
      var shapeFabricClassMap = {
        rect: fabric.Rect,
        polyline: fabric.Polyline,
        path: fabric.Path,
        circle: fabric.Circle
      };

      var defaultArg;

      if (this.props.shape === 'polyline') defaultArg = this.props.points || [];
      if (this.props.shape === 'path') defaultArg = '';

      this.fabricObject = new shapeFabricClassMap[this.props.shape](defaultArg);
    }
    else if (this.props.type === 'image') {
      this.fabricObject = new fabric.Image(this.props.image);
    }

    this.fabricObject.set({objectCaching: false, selectable: false});

    this.set(props);
  }

  set(props) {
    if (props.diameter) props.radius = props.diameter / 2;

    super.set(props);
  }

  addToCanvasView(canvasView) {
    super.addToCanvasView(canvasView);

    this.canvas.add(this.fabricObject);
  }

  removeFromCanvasView(options) {
    this.canvas.remove(this.fabricObject);

    this.isRemoved = true;

    super.removeFromCanvasView(options);
  }

  layout() {
    super.layout();

    var scale = this.scale;
    var props = {
      left: this.canvasView.offset.x + this.props.position.x * this.scale,
      top: this.canvasView.offset.y + this.props.position.y * this.scale,
      angle: this.props.rotation,
      originX: this.props.origin.x,
      originY: this.props.origin.y,
      strokeWidth: 1
    };

    _.extend(props, _.pick(this.props, ['zIndex', 'opacity', 'fill', 'stroke', 'radius', 'strokeWidth', 'rx', 'ry']));

    if (this.props.type === 'image') {
      props.scaleX = (this.props.size.width * this.scale) / this.fabricObject.width;
      props.scaleY = (this.props.size.height * this.scale) / this.fabricObject.height;

      if (this.props.fill) {
        this.fabricObject.filters[16] = new fabric.Image.filters.BlendColor({
          color: this.props.fill,
          mode: 'add',
          alpha: 1
        });

        this.fabricObject.applyFilters();
      }
    }
    else if (this.props.type === 'shape') {
      if (_.includes(['rect'], this.props.shape)) {
        _.extend(props, this.props.size);
      }

      if (this.props.shape === 'path') {
        props.path = this.props.path || this.pathArrayFrom({commands: this.props.commands});
        props.width = 10;
        props.height = 10;
      }
      else if (this.props.shape === 'polyline') {
        props.points = _.map(this.props.points || [], point => _.mapValues(point, p => p * scale));
      }
    }

    var scalePropKeys = ['radius', 'width', 'height', 'rx', 'ry', 'strokeWidth'];

    _.forEach(_.pick(props, scalePropKeys), (prop, key) => props[key] = prop * scale);

    this.fabricObject.set(props);
    
    if (this.props.shadow) {
      var scalePropKeys = ['offsetX', 'offsetY', 'blur'];

      var shadow = _.clone(this.props.shadow);

      _.forEach(_.pick(shadow, scalePropKeys), (prop, key) => shadow[key] = prop * scale);

      this.fabricObject.setShadow(shadow);
    }

    if (this.props.type === 'polyline' && props.points) {
      this.fabricObject._calcDimensions();
      this.fabricObject.pathOffset = {x: this.fabricObject.width / 2, y: this.fabricObject.height / 2};
    }

    this.fabricObject.setCoords();
  }

  pathArrayFrom({commands}) {
    var pathArray = [];
    var scale = this.scale;

    commands.forEach(({quadratic, cubic, point, ...command}, c) => {
      point = _.mapValues(point, p => p * scale);

      if (quadratic) {
        curvePoint = _.mapValues(command.curvePoint, p => p * scale);

        pathArray.push(['Q', point.x, point.y, curvePoint.x, curvePoint.y]);
      }
      else if (cubic) {
        var {start, end} = _.mapValues(command.controlPoints, point => _.mapValues(point, p => p * scale));

        pathArray.push(['C', start.x, start.y, end.x, end.y, point.x, point.y]);
      }
      else {
        pathArray.push([c === 0 ? 'M' : 'L', point.x, point.y]);
      }
    });

    if (this.props.closed) {
      pathArray.push(['Z']);
    }

    return pathArray;
  }

  static loadImages(imageUrls) {
    var promises = [];

    _.forEach(imageUrls, (url, key) => {
      promises.push(new Promise((success) => {
        fabric.util.loadImage(url, image => {
          success({key, image});
        });
      }));
    });

    return Promise.all(promises).then(m => _.mapValues(_.keyBy(m, 'key'), _.property('image')));
  }
}
