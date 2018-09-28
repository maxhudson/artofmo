export default class Color {
  constructor(color) {
    color.a /= 255;

    this.color = color;
  }

  //'#000000'
  toHex() {

  }

  //'rgba(0, 0, 0, 0)'
  toRgba() {

  }

  //{r, g, b, a}
  toObject() {

  }

  is(title, options) {
    var is = false;
    var {r, g, b, a} = this.color;

    var titleMatchFnMap = {
      dark: () => _.mean([r, g, b]) < 255 / 2 + 0.5,
      light: () => _.mean([r, g, b]) >= 255 / 2 + 0.5,
      black: () => _.isEqual(this.color, {r: 0, g: 0, b: 0, a: 1}),
      like: () => {
        return false; //is within 5 of average using data - tolerance-5
      }
    };

    if (titleMatchFnMap[title]) is = titleMatchFnMap[title]();

    return is;
  }

  get darkness() {
    return 1 - _.mean(_.map(_.pick(this.color, ['r', 'g', 'b']), v => v / 255));
  }

  get saturation() {

  }
}
