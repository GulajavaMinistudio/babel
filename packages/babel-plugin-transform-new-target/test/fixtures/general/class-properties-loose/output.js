class Foo {
  constructor() {
    var _newtarget = this.constructor,
      _Class;
    this.test = function _target() {
      this instanceof _target ? this.constructor : void 0;
    };
    this.test2 = function () {
      _newtarget;
    };
    this.Bar = (_Class = class {
      constructor() {
        // should not replace
        this.q = this.constructor;
      } // should not replace
    }, _Class.p = void 0, _Class.p1 = class {
      constructor() {
        this.constructor;
      }
    }, _Class.p2 = new function _target2() {
      this instanceof _target2 ? this.constructor : void 0;
    }(), _Class.p3 = function () {
      void 0;
    }, _Class.p4 = function _target3() {
      this instanceof _target3 ? this.constructor : void 0;
    }, _Class);
  }
}
