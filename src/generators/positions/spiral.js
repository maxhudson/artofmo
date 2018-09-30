//import _ from 'lodash';
//import {} from '../../core/util.js';

export default function spiral({ringCount=3, radius=1, spacing=1, angle=0, a=0.2, b=5, count=500}) {
  var positions = [];
  //var a = 0.2, b = 5; //correlate with radius

  for (var i = 0; i < count; i++) {
    angle -= 0.1;

    var x = (a + b * angle) * Math.cos(angle);
    var y = (a + b * angle) * Math.sin(angle);

    positions.push({x, y});
  }

  return {positions};
}
