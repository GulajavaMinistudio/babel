var _initProto, _Foo;
const dec = () => {};
class Foo {
  constructor() {
    babelHelpers.defineProperty(this, "value", 1);
    _initProto(this);
  }
  get a() {
    return this.value;
  }
  get ['b']() {
    return this.value;
  }
}
_Foo = Foo;
[_initProto] = babelHelpers.applyDecs2301(_Foo, [[dec, 3, "a"], [dec, 3, 'b']], []).e;
