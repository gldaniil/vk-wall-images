export default class CreatingElem {
  constructor(obj) {
    this.obj = obj;
  }
  #append(arr, parent) {
    parent = document.querySelector(parent);
    arr.forEach(el => {
      parent.append(el)
    });
  }
  #label(htmlFor, text) {
    const label = document.createElement("label");
    label.htmlFor = htmlFor;
    label.textContent = text;
    return label;
  }
  create(parent) {
    this.el = document.createElement(this.obj.tag);
    if (this.obj.tag === "input") {
      const domain = this.obj.id;
      const text = domain.charAt(0).toUpperCase() + domain.slice(1);
      this.el.id = domain;
      this.el.type = this.obj.type;
      this.el.name = this.obj.name;
      this.#append([this.el, this.#label(domain, text)], parent)
    }
  }
}
