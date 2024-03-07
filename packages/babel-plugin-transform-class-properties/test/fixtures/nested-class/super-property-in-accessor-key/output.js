"use strict";

let Hello = /*#__PURE__*/function () {
  function Hello() {
    babelHelpers.classCallCheck(this, Hello);
  }
  babelHelpers.createClass(Hello, [{
    key: "toString",
    value: function toString() {
      return 'hello';
    }
  }]);
  return Hello;
}();
let Outer = /*#__PURE__*/function (_Hello) {
  babelHelpers.inherits(Outer, _Hello);
  function Outer() {
    let _computedKey;
    var _thisSuper, _this;
    babelHelpers.classCallCheck(this, Outer);
    _this = babelHelpers.callSuper(this, Outer);
    var _A = /*#__PURE__*/new WeakMap();
    _computedKey = babelHelpers.toPropertyKey(babelHelpers.get((_thisSuper = babelHelpers.assertThisInitialized(_this), babelHelpers.getPrototypeOf(Outer.prototype)), "toString", _thisSuper).call(_thisSuper));
    let Inner = /*#__PURE__*/function (_computedKey4, _computedKey5) {
      function Inner() {
        babelHelpers.classCallCheck(this, Inner);
        babelHelpers.classPrivateFieldInitSpec(this, _A, 'hello');
      }
      babelHelpers.createClass(Inner, [{
        key: _computedKey4,
        get: function () {
          return babelHelpers.classPrivateFieldGet2(_A, this);
        }
      }, {
        key: _computedKey5,
        set: function (v) {
          babelHelpers.classPrivateFieldSet2(_A, this, v);
        }
      }]);
      return Inner;
    }(_computedKey, _computedKey);
    return babelHelpers.possibleConstructorReturn(_this, new Inner());
  }
  return babelHelpers.createClass(Outer);
}(Hello);
expect(new Outer().hello).toBe('hello');
