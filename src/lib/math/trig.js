var trig;

trig = {
  dist(p1, p2) {
    return Math.sqrt(trig.dist2(p1, p2));
  },

  dist2(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  },

  radiansToDegrees(radians) {
    return (radians * 180) / Math.PI;
  },

  degreesToRadians(degrees) {
    return (degrees / 180) * Math.PI;
  },

  distance({fromPoint, toLine, toPoint}) {
    if (toLine) {
      var p = fromPoint, lp1 = toLine.from, lp2 = toLine.to;

      var l2 = trig.dist2(lp1, lp2);

      if (l2 === 0) return Math.sqrt(trig.dist2(p, lp1));

      var t = Math.max(0, Math.min(1, ((p.x - lp1.x) * (lp2.x - lp1.x) + (p.y - lp1.y) * (lp2.y - lp1.y)) / l2));

      return Math.sqrt(trig.dist2(p, {
        x: lp1.x + t * (lp2.x - lp1.x),
        y: lp1.y + t * (lp2.y - lp1.y)
      }));
    }
    else if (toPoint) {
      return trig.dist(fromPoint, toPoint);
    }
  },

  nearestPoint({point, onLine}) {
    var p = point, a = onLine.from, b = onLine.to;

    var atob = { x: b.x - a.x, y: b.y - a.y };
    var atop = { x: p.x - a.x, y: p.y - a.y };
    var len = atob.x * atob.x + atob.y * atob.y;
    var dot = atop.x * atob.x + atop.y * atob.y;
    var t = Math.min(1, Math.max(0, dot / len));

    dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

    return {x: a.x + atob.x * t, y: a.y + atob.y * t};
  },

  rotate({point, position, canvasPosition, byRadians=0, byDegrees, aroundOrigin}) {
    if (byDegrees) byRadians = trig.degreesToRadians(byDegrees);
    if (position) point = position;
    if (canvasPosition) point = {x: canvasPosition.left, y: canvasPosition.top};

    if (byRadians !== 0) {
      if (aroundOrigin) point = {x: point.x - aroundOrigin.x, y: point.y - aroundOrigin.y};

      point = {
        x: point.x * Math.cos(byRadians) - point.y * Math.sin(byRadians),
        y: point.y * Math.cos(byRadians) + point.x * Math.sin(byRadians)
      };

      if (aroundOrigin) point = {x: point.x + aroundOrigin.x, y: point.y + aroundOrigin.y};
      if (canvasPosition) canvasPosition = {left: point.x, top: point.y};
    }

    return canvasPosition || point;
  },

  //slope of line
  alpha({p1, p2, perpendicular=0}) {
    var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;

    var delta = {x: x2 - x1, y: y2 - y1};
    var alpha = Math.atan2(delta.y, delta.x);

    if (perpendicular) alpha += ((Math.PI / 2) * perpendicular);

    return alpha;
  },

  //angle between two normalized vectors
  theta({p1, p2, radians, degrees}) {
    var theta;

    if (p1 && p2) {
      var a2 = Math.atan2(p1.y, p1.x);
      var a1 = Math.atan2(p2.y, p2.x);
      var sign = a1 > a2 ? 1 : -1;
      var angle = a1 - a2;
      var K = -sign * Math.PI * 2;

      theta = (Math.abs(K + angle) < Math.abs(angle)) ? K + angle : angle;
    }
    else if (degrees) {
      theta = trig.normalize({degrees: degrees[0] - degrees[1]});
    }
    else if (radians) {
      theta = trig.normalize({radians: radians[0] - radians[1]});
    }

    return theta;
  },

  extend({line, by=1000000}) {
    var {from, to} = line;
    var alpha = Math.atan2(to.y - from.y, to.x - from.x);

    return {
      from: {x: from.x - by * Math.cos(alpha), y: from.y - by * Math.sin(alpha)},
      to: {x: to.x + by * Math.cos(alpha), y: to.y + by * Math.sin(alpha)}
    };
  },

  isOnLine({point, line}) {
    var d = trig.dist;

    return Math.abs(d(line.from, line.to) - d(line.from, point) - d(line.to, point)) < Number.EPSILON;
  },

  inside({point, polygon}) {
    var {x, y} = point;
    var inside = false;

    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i].x, yi = polygon[i].y;
      var xj = polygon[j].x, yj = polygon[j].y;

      var intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  },

  closestAngle({target, sources}) {
    var angleDelta = (a, b) => {
      var d = Math.abs(a - b);

      return d > Math.PI ? (Math.PI * 2) - d : d;
    };

    var deltas = sources.map(source => angleDelta(source, target));
    var closestSourceIndex = deltas.indexOf(_.min(deltas));

    return sources[closestSourceIndex];
  },

  furthestAngle({target, sources}) {
    var angleDelta = (a, b) => {
      var d = Math.abs(a - b);

      return d > Math.PI ? (Math.PI * 2) - d : d;
    };

    var deltas = sources.map(source => angleDelta(source, target));
    var closestSourceIndex = deltas.indexOf(_.max(deltas));

    return sources[closestSourceIndex];
  },

  translate({point, by, alpha}){
    return {
      x: point.x + Math.cos(alpha) * by,
      y: point.y + Math.sin(alpha) * by
    };
  },

  normalize({degrees, radians}) {
    if (degrees !== undefined) radians = trig.degreesToRadians(degrees);

    while (radians > Math.PI * 2) radians -= Math.PI * 2;
    while (radians < 0) radians += Math.PI * 2;

    if (radians === Math.PI * 2) radians = 0; //0..<2pi

    return degrees !== undefined ? trig.radiansToDegrees(radians) : radians;
  }
};

export default trig;
