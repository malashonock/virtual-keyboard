import { Component } from "./utilities.mjs";
import { loadJsonAsync } from "./loadJsonAsync.mjs";
import { Key } from "./key.mjs";

export class Keyboard extends EventTarget {
  element = null;
  layout = [];
  #shiftPressed = false;
  #capsLockOn = false;
  #altPressed = false;
  #ctrlPressed = false;
  #metaPressed = false;

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
      this.updateLayout();

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

  get altPressed() {
    return this.#altPressed;
  }

  set altPressed(value) {
    if (this.#altPressed !== value) {
      this.updateLayout();

      this.#altPressed = value;

      this.dispatchEvent(
        new CustomEvent("altChanged", {
          detail: {
            altPressed: this.#altPressed,
          },
        })
      );
    }
  }

  get ctrlPressed() {
    return this.#ctrlPressed;
  }

  set ctrlPressed(value) {
    if (this.#ctrlPressed !== value) {
      this.#ctrlPressed = value;

      this.dispatchEvent(
        new CustomEvent("ctrlChanged", {
          detail: {
            ctrlPressed: this.#ctrlPressed,
          },
        })
      );
    }
  }

  get metaPressed() {
    return this.#metaPressed;
  }

  set metaPressed(value) {
    if (this.#metaPressed !== value) {
      this.#metaPressed = value;

      this.dispatchEvent(
        new CustomEvent("metaChanged", {
          detail: {
            metaPressed: this.#metaPressed,
          },
        })
      );
    }
  }

  async loadLayout() {
    const keyboardLayouts = await loadJsonAsync("keys.json");
    this.layout = [...keyboardLayouts[this.language]];
  }

  updateLayout() {
    if (this.shiftPressed && this.altPressed) {
      this.language = this.language === "en" ? "ru" : "en";

      localStorage.setItem("keyboardLanguage", this.language);

      this.dispatchEvent(
        new CustomEvent("keyboardLanguageChanged", {
          detail: this.language,
        })
      );

      this.loadLayout().then(() => this.render());
    }
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
            capsLockOn: this.capsLockOn,
            shiftPressed: this.shiftPressed,
            altPressed: this.altPressed,
            ctrlPressed: this.ctrlPressed,
            metaPressed: this.metaPressed,
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

      this.shiftPressed = event.shiftKey;
      this.altPressed = event.altKey;
      this.ctrlPressed = event.ctrlKey;
      this.metaPressed = event.metaKey;

      if (event.isTrusted) {
        const key = this.element.querySelector(`#${event.code}`);
        key?.dispatchEvent(new MouseEvent("mousedown"));
      }
    });

    document.addEventListener("keyup", (event) => {
      this.shiftPressed = event.shiftKey;
      this.altPressed = event.altKey;
      this.ctrlPressed = event.ctrlKey;
      this.metaPressed = event.metaKey;

      switch (event.code) {
        case "CapsLock":
          this.capsLockOn = !this.capsLockOn;
          break;

        default:
          break;
      }

      if (event.isTrusted) {
        const key = this.element.querySelector(`#${event.code}`);
        key?.dispatchEvent(new MouseEvent("mouseup"));
      }
    });
  }
}
