import evenlyDistributedFor from '../generators/positions/evenly-distributed-for.js';
//import plantSpiral from '../generators/positions/plant-spiral.js';
import spiralFor from '../generators/positions/spiral-for.js';

import forCurveThrough from '../generators/path-commands/for-curve-through.js';

export default {
  positions: {evenlyDistributedFor, /*plantSpiral, */spiralFor},
  pathCommands: {forCurveThrough}
};
