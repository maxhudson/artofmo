import Class from '../core/class.js';
import {fabric} from '../core/fabric.js';

export default class CanvasView extends Class {
  constructor(props) {
    super(_.defaults(props, {
      _container: undefined,
      scale: 1,
      id: `canvas-${Math.floor(Math.random() * 1000000000)}`
    }));

    this.objects = {};

    this.create();
  }

  set(props) {
    super.set(props);

    if (props.size || props.scale) this.resize();
  }

  create() {
    this._container = this.props._container;
    this._container.innerHTML = `<canvas id="${this.props.id}">`;
    this._canvas = document.getElementById(this.props.id);

    this.canvas = new fabric.StaticCanvas(this.props.id, {
      selection: false,
      backgroundColor: '#fff',
      objectCaching: false,
      ...this.props.canvasOptions
    });

    this.canvas.renderOnAddRemove = false;

    window.addEventListener('resize', this.resize.bind(this));

    this.resize();
  }

  resize() {
    this.canvas.setDimensions({
      width: _.floor(this.props.size.width * this.scale),
      height: _.floor(this.props.size.height * this.scale)
    });

    this.origin = {
      x: this.props.size.width * this.scale / 2,
      y: this.props.size.height * this.scale / 2
    };

    this.render({layout: true});
  }

  add({object}) {
    this.objects[object] = object;

    object.addToCanvasView(this);
  }

  remove({object}) {
    delete this.objects[object];

    object.removeFromCanvasView();
  }

  layout() {
    this.forEachObject(object => object.layout());
  }

  forEachObject(fn) {
    _.forEach(this.objects, (object, o) => {
      if (!object.isRemoved) {
        fn(object, o);
      }
    });
  }

  render({layout=false} = {}) {
    if (layout) this.layout();

    this.canvas.renderAll();
  }

  destroy() {
    this.$canvas.remove();
  }

  get offset() {
    return this.origin;
  }

  get scale() {
    return this.props.scale;
  }
}
