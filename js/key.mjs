import Component from "./component.mjs";

export default class Key extends EventTarget {
  element = null;

  #content = "";

  #clicked = false;

  #capsLockOn = false;

  #shiftPressed = false;

  #altPressed = false;

  #ctrlPressed = false;

  #metaPressed = false;

  constructor(parent, props) {
    super();

    this.parent = parent;
    this.code = props.code;
    this.cap = props.cap;
    this.capsCap = props.capsCap;
    this.shiftCap = props.shiftCap;

    this.#capsLockOn = props.capsLockOn;
    this.#shiftPressed = props.shiftPressed;
    this.#altPressed = props.altPressed;
    this.#ctrlPressed = props.ctrlPressed;
    this.#metaPressed = props.metaPressed;

    this.render();

    this.#addEventListeners();
  }

  get content() {
    return this.element.innerHTML || this.#content;
  }

  get clicked() {
    return this.#clicked;
  }

  set clicked(value) {
    if (this.#clicked !== value) {
      this.#clicked = value;
      this.element.classList.toggle("clicked", value);
    }
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

  get altPressed() {
    return this.#altPressed;
  }

  set altPressed(value) {
    if (this.#altPressed !== value) {
      this.#altPressed = value;
    }
  }

  get ctrlPressed() {
    return this.#ctrlPressed;
  }

  set ctrlPressed(value) {
    if (this.#ctrlPressed !== value) {
      this.#ctrlPressed = value;
    }
  }

  get metaPressed() {
    return this.#metaPressed;
  }

  set metaPressed(value) {
    if (this.#metaPressed !== value) {
      this.#metaPressed = value;
    }
  }

  render() {
    if (this.shiftPressed && this.capsLockOn) {
      this.#content = this.shiftCap || this.cap;
    } else if (this.shiftPressed) {
      this.#content = this.shiftCap || this.capsCap || this.cap;
    } else if (this.capsLockOn) {
      this.#content = this.capsCap || this.cap;
    } else {
      this.#content = this.cap;
    }

    if (this.element) {
      this.element.innerHTML = this.#content;
    } else {
      this.element = new Component({
        tag: "button",
        id: this.code,
        classList: ["button", "keyboard__key"],
        attributes: [{ name: "type", value: "button" }],
        innerHTML: this.#content,
        parent: this.parent.element,
      });
    }
  }

  #addEventListeners() {
    this.parent.addEventListener("capsLockChanged", (event) => {
      this.capsLockOn = event.detail.capsLockOn;
    });

    ["shift", "alt", "ctrl", "meta"].forEach((modifierType) => {
      this.parent.addEventListener(`${modifierType}Changed`, (customEvent) => {
        this[`${modifierType}Pressed`] = customEvent.detail[`${modifierType}Pressed`];
      });
    });

    this.element.addEventListener("mousedown", (event) => {
      this.#click();
      this.#emitKeyDownEvent(event);
    });

    this.element.addEventListener("mouseup", (event) => {
      this.#unclick();
      this.#emitKeyUpEvent(event);
    });

    this.element.addEventListener("mouseleave", (event) => {
      if (this.clicked) {
        this.#unclick();
        this.#emitKeyUpEvent(event);
      }
    });
  }

  #click() {
    this.clicked = true;
  }

  #unclick() {
    if (!(this.code === "CapsLock" && this.capsLockOn)) {
      this.clicked = false;
    }
  }

  #emitKeyDownEvent(mouseDownEvent) {
    if (mouseDownEvent.isTrusted) {
      const keyboardEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: this.content,
        code: this.code,
        shiftKey: this.code.match(/Shift/) || this.shiftPressed,
        altKey: this.code.match(/Alt/) || this.altPressed,
        ctrlKey: this.code.match(/Control/) || this.ctrlPressed,
        metaKey: this.code.match(/Meta/) || this.metaPressed,
      });

      document.dispatchEvent(keyboardEvent);
    }
  }

  #emitKeyUpEvent(mouseUpEvent) {
    if (mouseUpEvent.isTrusted) {
      const event = new KeyboardEvent("keyup", {
        bubbles: true,
        key: this.content,
        code: this.code,
        shiftKey: !this.code.match(/Shift/) && this.shiftPressed,
        altKey: !this.code.match(/Alt/) && this.altPressed,
        ctrlKey: !this.code.match(/Control/) && this.ctrlPressed,
        metaKey: !this.code.match(/Meta/) && this.metaPressed,
      });

      document.dispatchEvent(event);
    }
  }
}
