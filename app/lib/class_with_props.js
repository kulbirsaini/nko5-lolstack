'use strict';

const _ = require('lodash');

class ClassWithProps {
  constructor(props) {
    this.props = props;
  }

  setProp(name, value) {
    this.props[name] = value;
  }

  setProps(newProps) {
    this.props = Object.assign({}, newProps);
  }

  getProp(name, default_value) {
    return _.get(this.props, name, default_value);
  }

  getProps() {
    return this.props;
  }

  getPropsOnly(fields) {
    return _.pick(this.props, fields || []);
  }

  getPropsWithout(fields) {
    return _.pick(this.props, _.difference(Object.keys(this.props), fields || []));
  }

  toJSON() {
    return this.props;
  }
}

module.exports = ClassWithProps;
