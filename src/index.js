import generate from './core/generate.js';
import canvas from './core/canvas.js';
import initializers from './core/initialize.js';
import util from './core/util.js';
import colors from './colors/index.js';

var mo = global.mo = {};

_.extend(mo, canvas.classes);

mo.g = mo.generate = generate;
mo.c = mo.canvas = canvas;
mo.util = util;
mo.ui = {init: initializers};
mo.colors = colors;

mo.domReady = false;

document.addEventListener("DOMContentLoaded", () => {
  mo.domReady = true;
});
