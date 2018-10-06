export default function forCurveThrough({points, smoothing=1, close=false}) {
  smoothing = smoothing / 10;

  const line = (pointA, pointB) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;

    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  const controlPoint = (current, previous, next, reverse) => {

    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current;
    const n = next || current;

    // Properties of the opposed-line
    const o = line(p, n);

    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * (current.smoothing || smoothing);

    // The control point position is relative to the current point
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;

    return {x, y};
  };

  const bezierCommand = ({point, p}) => {
    return {cubic: true, point, controlPoints: {
      start: controlPoint(points[p - 1], points[p - 2], point),
      end: controlPoint(point, points[p - 1], points[p + 1], true)
    }};
  };

  var commands = points.reduce((commands, point, p) => {
    return [...commands, p === 0 ? {point} : bezierCommand({point, p})];
  }, []);

  if (close) {
    commands.push({point: point[0]});
  }

  return commands;
}
