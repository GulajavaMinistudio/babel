var _initProto, _Foo;
const dec = () => {};
class Foo {
  constructor() {
    babelHelpers.defineProperty(this, "value", 1);
    _initProto(this);
  }
  a() {
    return this.value;
  }
  ['b']() {
    return this.value;
  }
}
_Foo = Foo;
[_initProto] = babelHelpers.applyDecs2305(_Foo, [[dec, 2, "a"], [dec, 2, 'b']], []).e;
