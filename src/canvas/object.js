import Class from '../core/class.js';

export default class CanvasObject extends Class {
  constructor(props) {
    super(_.defaults(props, {
      position: {x: 0, y: 0},
      size: {width: 0, height: 0},
      rotation: 0,
      zIndex: 0,
      origin: {x: 'center', y: 'center'},
      fill: '',
      stroke: ''
    }));
  }

  set(props) {
    super.set(props);
  }

  addToCanvasView(canvasView) {
    this.canvasView = canvasView;
    this.canvas = canvasView.canvas;
  }

  removeFromCanvasView({dereference=true} = {}) {
    if (dereference) delete this.canvasView.objects[this];

    delete this.canvasView;
    delete this.canvas;
  }

  layout() {

  }

  toString() {
    return Math.random() + ``;
  }

  get scale() {
    return this.canvasView.scale;
  }
}
