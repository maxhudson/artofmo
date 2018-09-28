import generate from './core/generate.js';
import canvas from './core/canvas.js';
import initializers from './core/initialize.js'
import lib from './core/lib.js';

var mo = global.mo = {};

_.extend(mo, canvas.classes);

mo.g = mo.generate = generate;
mo.c = mo.canvas = canvas;
mo.lib = lib;
mo.ui = {init: initializers};

mo.domReady = false;

document.addEventListener("DOMContentLoaded", () => {
  mo.domReady = true;
});
