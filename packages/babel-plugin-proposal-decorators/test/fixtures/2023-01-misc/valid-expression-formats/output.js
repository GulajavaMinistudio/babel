var _initProto, _initClass, _classDecs, _methodDecs;
const dec = () => {};
_classDecs = [dec, call(), chain.expr(), arbitrary + expr, array[expr]];
_methodDecs = [dec, call(), chain.expr(), arbitrary + expr, array[expr]];
let _Foo;
class Foo {
  static {
    ({
      e: [_initProto],
      c: [_Foo, _initClass]
    } = babelHelpers.applyDecs2301(this, [[_methodDecs, 2, "method"]], _classDecs));
  }
  #a = void _initProto(this);
  method() {}
  makeClass() {
    var _barDecs, _init_bar;
    return _barDecs = this.#a, class Nested {
      static {
        [_init_bar] = babelHelpers.applyDecs2301(this, [[_barDecs, 0, "bar"]], []).e;
      }
      bar = _init_bar(this);
    };
  }
  static {
    _initClass();
  }
}
