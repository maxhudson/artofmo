export default function evenlyDistributedPositions({precision=0.01, spacing=1, count=5, scale=1, f}) {
  var dx = precision, s = spacing, x = 0, positions = [];

  while (positions.length < count) {
    var y = f(x);
    var dy = f(x + dx) - y;
    var ds = Math.sqrt(dx * dx + dy * dy);

    s += ds;

    if (s >= spacing) {
      positions.push({x: x * scale, y: y * scale});

      s -= spacing;
    }

    x += dx;
  }

  return positions;
}
