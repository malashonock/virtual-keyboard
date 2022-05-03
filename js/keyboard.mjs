import { Component } from "./utilities.mjs";
import { loadJsonAsync } from "./loadJsonAsync.mjs";
import { Key } from "./key.mjs";

export class Keyboard extends EventTarget {
  element = null;
  layout = [];
  #shiftPressed = false;
  #capsLockOn = false;

  constructor(parent) {
    super();

    this.language = localStorage.getItem("keyboardLanguage") || "en";
    this.parent = parent || document.body;

    this.loadLayout()
      .then(() => this.render())
      .then(() => this.addEventListeners());
  }

  get capsLockOn() {
    return this.#capsLockOn;
  }

  set capsLockOn(value) {
    if (this.#capsLockOn !== value) {
      this.#capsLockOn = value;

      this.dispatchEvent(
        new CustomEvent("capsLockChanged", {
          detail: {
            capsLockOn: this.#capsLockOn,
          },
        })
      );
    }
  }

  get shiftPressed() {
    return this.#shiftPressed;
  }

  set shiftPressed(value) {
    if (this.#shiftPressed !== value) {
      this.#shiftPressed = value;

      this.dispatchEvent(
        new CustomEvent("shiftChanged", {
          detail: {
            shiftPressed: this.#shiftPressed,
          },
        })
      );
    }
  }

  async loadLayout() {
    const keyboardLayouts = await loadJsonAsync("keys.json");
    this.layout = [...keyboardLayouts[this.language]];
  }

  render() {
    this.element = new Component({
      classList: ["keyboard"],
      parent: this.parent,
      insertMethod: "replace",
    });

    for (const row of this.layout) {
      const rowWrapper = new Component({
        classList: ["keyboard__row"],
        parent: this.element,
      });

      const rowKeys = row.map(
        (key) =>
          new Key(this, {
            code: key.code,
            cap: key.cap,
            capsCap: key.capsCap,
            shiftCap: key.shiftCap,
          })
      );

      for (const key of rowKeys) {
        rowWrapper.append(key.element);
      }
    }
  }

  addEventListeners() {
    document.addEventListener("keydown", (event) => {
      if (!event.code.match(/F\d{1,2}/)) {
        event.preventDefault();
      }

      if (event.shiftKey && event.altKey) {
        this.language = this.language === "en" ? "ru" : "en";

        localStorage.setItem("keyboardLanguage", this.language);

        this.dispatchEvent(
          new CustomEvent("keyboardLanguageChanged", {
            detail: this.language,
          })
        );

        this.loadLayout().then(() => this.render());
      }

      if (event.shiftKey) {
        this.shiftPressed = true;
      }

      const key = this.element.querySelector(`#${event.code}`);
      key?.dispatchEvent(new MouseEvent("mousedown"));
    });

    document.addEventListener("keyup", (event) => {
      if (this.shiftPressed && !event.shiftKey) {
        this.shiftPressed = false;
      }

      switch (event.code) {
        case "CapsLock":
          this.capsLockOn = !this.capsLockOn;
          break;

        default:
          break;
      }

      const key = this.element.querySelector(`#${event.code}`);
      key?.dispatchEvent(new MouseEvent("mouseup"));
    });

    document.addEventListener("mousedown", (event) => {
      if (event.target.id.match(/Shift/)) {
        this.shiftPressed = true;
      }
    });

    document.addEventListener("mouseup", (event) => {
      if (this.shiftPressed && event.target.id.match(/Shift/)) {
        this.shiftPressed = false;
      }

      switch (event.target.id) {
        case "CapsLock":
          this.capsLockOn = !this.capsLockOn;
          break;

        default:
          break;
      }
    });
  }
}
