var Foo = /*#__PURE__*/function (_Bar) {
  "use strict";

  function Foo() {
    var _this;
    babelHelpers.classCallCheck(this, Foo);
    var t = () => babelHelpers.superPropGet((babelHelpers.assertThisInitialized(_this), Foo), "test", _this, 3)([]);
    babelHelpers.superPropGet((babelHelpers.assertThisInitialized(_this), Foo), "foo", _this, 3)([]);
    return _this = babelHelpers.callSuper(this, Foo);
  }
  babelHelpers.inherits(Foo, _Bar);
  return babelHelpers.createClass(Foo);
}(Bar);
