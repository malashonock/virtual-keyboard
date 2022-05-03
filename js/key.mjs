import { Component } from "./utilities.mjs";

export class Key extends EventTarget {
  element = null;
  #shiftPressed = false;
  #capsLockOn = false;

  constructor(parent, props) {
    super();

    this.parent = parent;
    this.code = props.code;
    this.cap = props.cap;
    this.capsCap = props.capsCap;
    this.shiftCap = props.shiftCap;

    this.render();

    this.addEventListeners();
  }

  get capsLockOn() {
    return this.#capsLockOn;
  }

  set capsLockOn(value) {
    if (this.#capsLockOn !== value) {
      this.#capsLockOn = value;
      this.render();
    }
  }

  get shiftPressed() {
    return this.#shiftPressed;
  }

  set shiftPressed(value) {
    if (this.#shiftPressed !== value) {
      this.#shiftPressed = value;
      this.render();
    }
  }

  render() {
    let content;

    if (this.shiftPressed && this.capsLockOn) {
      content = this.shiftCap || this.cap;
    } else if (this.shiftPressed) {
      content = this.shiftCap || this.capsCap || this.cap;
    } else if (this.capsLockOn) {
      content = this.capsCap || this.cap;
    } else {
      content = this.cap;
    }

    if (this.element) {
      this.element.innerHTML = content;
    } else {
      this.element = new Component({
        tag: "button",
        id: this.code,
        classList: ["button", "keyboard__key"],
        attributes: [{ name: "type", value: "button" }],
        innerHTML: content,
        parent: this.parent.element,
      });
    }
  }

  addEventListeners() {
    this.parent.addEventListener("shiftChanged", (event) => {
      this.shiftPressed = event.detail.shiftPressed;
    });

    this.parent.addEventListener("capsLockChanged", (event) => {
      this.capsLockOn = event.detail.capsLockOn;
    });

    this.element.addEventListener("mousedown", (event) => {
      this.element.classList.add("clicked");

      const textarea = document.querySelector(".textarea");
      textarea.focus();

      switch (this.code) {
        case "Backspace":
          textarea.value = textarea.value.slice(0, -1);
          break;

        case "Tab":
          textarea.value += "\t";
          break;
        
        case "Enter":
          textarea.value += "\n";
          break;

        case "Delete":
          const start = textarea.selectionStart;
          const end =
            textarea.selectionEnd === textarea.selectionStart
              ? textarea.selectionEnd + 1
              : textarea.selectionEnd;
          textarea.setRangeText("", start, end);
          break;
        
        case "ArrowLeft":
          // to-do
          break;
          
          case "ArrowRight":
          // to-do
          break;
        
        case "ArrowUp":
          // to-do
          break;
        
        case "ArrowDown":
          // to-do
          break;

        case "CapsLock":
        case "ShiftLeft":
        case "ShiftRight":
        case "ControlLeft":
        case "ControlRight":
        case "AltLeft":
        case "AltRight":
        case "MetaLeft":
          // nothing is added to textarea
          break;

        default:
          textarea.value += this.element.innerHTML;
          break;
      }
    });

    this.element.addEventListener("mouseup", (event) => {
      if (!(this.code === "CapsLock" && this.capsLockOn)) {
        this.element.classList.remove("clicked");
      }
    });
  }
}
