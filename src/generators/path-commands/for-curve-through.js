export default function forCurveThrough({points}) {
  var commands = [{point: points[0]}];
  var i;

  for (i = 1; i < points.length - 2; i++) {
    var curvePoint = {
      x: (points[i].x + points[i + 1].x) / 2,
      y: (points[i].y + points[i + 1].y) / 2
    };

    commands.push({quadratic: true, point: points[i], curvePoint});
  }

  commands.push({quadratic: true, point: points[i], curvePoint: points[i+1]});

  return commands;
}
