import FabricCanvasObject from '../../canvas/fabric/object.js';
import CanvasView from '../../canvas/view.js';
import lib from '../../core/lib';
import _ from 'lodash';

export default function basic({
  containerId,
  images={},
  overlay=true,
  size={width: 500, height: 500},
  renderScale=4,
  backgroundColor='#ffffff'
}) {
  return new Promise((resolve, reject) => {
    var onDomReady = () => {
      var _container = document.getElementById(containerId);

      _container.innerHTML = `
        <div class="mo-canvas-container"></div>
        <div class="mo-render">Render</div>
        <div class="mo-render-print">Render Print</div>
      `;

      var _render = _container.querySelector('.mo-render');
      var _renderPrint = _container.querySelector('.mo-render-print');
      var _upperCanvas = _container.querySelector('.upper-canvas');

      var canvasView = new CanvasView({
        _container: _container,
        size,
        canvasOptions: {backgroundColor}
      });

      if (overlay) {
        var overlayObject;

        images.overlay = 'https://i.imgur.com/aUVVjL1.jpg';

        _renderPrint.addEventListener('click', () => {
          if (overlayObject.canvasView) canvasView.remove({object: overlayObject});

          canvasView.set({scale: renderScale});

          _upperCanvas.remove();
        });
      }

      _render.addEventListener('click', event => {
        canvasView.set({scale: renderScale});

        _upperCanvas.remove();
      });

      FabricCanvasObject.loadImages(images).then(images => {
        overlayObject = new FabricCanvasObject({
          type: 'image',
          image: images.overlay,
          size,
          origin: {x: 'center', y: 'center'},
          opacity: 0.4,
          zIndex: 1000,
          position: {x: 0, y: 0}
        });

        canvasView.add({object: overlayObject});

        resolve({
          canvasView, images, size,
          render: () => canvasView.render({layout: true}),
          offset: {x: 0, y: 0},
          ..._.pick(lib, ['rand', 'randInt'])
        });
      }, null, 'Anonymous');
    };

    if (mo.domReady) {
      onDomReady();
    }
    else {
      document.addEventListener("DOMContentLoaded", onDomReady);
    }
  });
}
