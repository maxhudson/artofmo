var lib = {
  rand: (size=1, factor=0) => Math.random() * Math.abs(size) + (factor ? Math.abs(size) * factor : 0),
  randInt: (factor) => _.floor(mo.rand() * factor),
  math: {trig: {}}
};

export default lib;
