import { Component } from "./_utilities.mjs";

export class Key extends EventTarget {
  element = null;
  shiftPressed = false;

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
    if (this.element) {
      this.element.innerHTML = this.shiftPressed ? this.shiftCap : this.cap;
    } else {
      this.element = new Component({
        tag: "button",
        id: this.code,
        classList: ["button", "keyboard__key"],
        attributes: [{ name: "type", value: "button" }],
        innerHTML: this.shiftPressed ? this.shiftCap : this.cap,
        parent: this.parent.element,
      });
    }
  }

  addEventListeners() {
    this.parent.addEventListener("shiftPressed", (event) => {
      this.shiftPressed = event.detail.shiftPressed;
      this.render();
    });

    this.parent.addEventListener("shiftReleased", (event) => {
      this.shiftPressed = event.detail.shiftPressed;
      this.render();
    });
  }
}
