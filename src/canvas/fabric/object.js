import CanvasObject from '../object.js';
import {fabric} from '../../core/fabric.js';

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
        circle: fabric.Circle
      };

      this.fabricObject = new shapeFabricClassMap[this.props.shape](this.props.points || []);
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

    //this.fabricObject.set();
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

    var props = {
      left: this.canvasView.offset.x + this.props.position.x * this.scale,
      top: this.canvasView.offset.y + this.props.position.y * this.scale,
      angle: this.props.rotation,
      originX: this.props.origin.x,
      originY: this.props.origin.y,
    };

    _.extend(props, _.pick(this.props, ['zIndex', 'opacity', 'fill', 'stroke', 'radius', 'strokeWidth']));

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

    if (this.props.type === 'shape' && _.includes(['rect'], this.props.shape)) {
      _.extend(props, this.props.size);
    }

    var scalePropKeys = ['radius', 'width', 'height'];

    _.forEach(_.pick(props, scalePropKeys), (prop, key) => props[key] = prop * this.scale);

    this.fabricObject.set(props);
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
