import FabricCanvasObject from '../../canvas/fabric/object.js';
import CanvasView from '../../canvas/view.js';
import util from '../../core/util';
import _ from 'lodash';

export default function basic({
  containerId,
  images={},
  overlay=true,
  size={width: 500, height: 500},
  renderScale=4,
  backgroundColor='#ffffff'
}) {
  return new Promise((resolve) => {
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
      var _canvasContainer = _container.querySelector('.mo-canvas-container');

      var canvasView = new CanvasView({
        _container: _canvasContainer,
        size,
        canvasOptions: {backgroundColor}
      });

      if (overlay) {
        var overlayObject;

        images.overlay = 'https://i.postimg.cc/jjc1KWX2/overlay-01.png';

        _renderPrint.addEventListener('click', () => {
          if (overlayObject.canvasView) canvasView.remove({object: overlayObject});

          canvasView.set({scale: renderScale});

          _upperCanvas && _upperCanvas.remove();
        });
      }

      _render.addEventListener('click', () => {
        canvasView.set({scale: renderScale});

        _upperCanvas && _upperCanvas.remove();
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
          ..._.pick(util, ['rand', 'randInt', 'sum', 'min', 'max'])
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
