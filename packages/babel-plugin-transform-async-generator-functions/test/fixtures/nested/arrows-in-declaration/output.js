var _g;
function g() {
  return (_g = _g || babelHelpers.wrapAsyncGenerator(function* () {
    var _this = this;
    () => this;
    function f() {
      () => this;
    }
    /*#__PURE__*/babelHelpers.asyncToGenerator(function* () {
      _this;
      yield 1;
    });
    yield babelHelpers.awaitAsyncGenerator(1);
  })).apply(this, arguments);
}
