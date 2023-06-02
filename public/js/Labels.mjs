export default class CreatingElem {
  constructor(obj) {
    this.el = document.createElement(obj.tag);
    this.el.id = obj.id;
    this.create();
  }
  create() {
    console.log(this.el);
  }
  append() {
    console.log("skip");
  }
  input(id, type, name) {
    this.elem.id = id;
    this.elem.type = type;
    this.elem.name = name;
  }
}
