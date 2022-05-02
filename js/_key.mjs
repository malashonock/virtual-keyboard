import { Component } from "./_utilities.mjs";

export class Key extends EventTarget {
  element = null;

  constructor(parent, props) {
    super();

    this.parent = parent;
    this.code = props.code;
    this.cap = props.cap;
    this.shiftCap = props.shiftCap || this.cap;

    this.render();

    this.addEventListeners();
  }

  render() {
    this.element = new Component({
      tag: "button",
      id: this.code,
      classList: ["button", "keyboard__key"],
      attributes: [{ name: "type", value: "button" }],
      innerHTML: this.cap,
      parent: this.parent,
    });
  }

  addEventListeners() {}
}
