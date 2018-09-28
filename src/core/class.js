export default class Class {
  constructor(props, options) {
    this.props = props;
    this.options = options;
  }

  set(props) {
    _.extend(this.props, props);
  }
}
