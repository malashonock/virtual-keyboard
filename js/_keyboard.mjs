import { Component } from "./_utilities.mjs";
import { loadJsonAsync } from "./_loadJsonAsync.mjs";
import { Key } from "./_key.mjs";

export class Keyboard extends EventTarget {
  element = null;
  layout = [];
  shiftPressed = false;

  constructor(parent) {
    super();

    this.language = localStorage.getItem("keyboardLanguage") || "en";
    this.parent = parent || document.body;

    this.loadLayout()
      .then(() => this.render())
      .then(() => this.addEventListeners());
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
            key: key.code,
            cap: key.cap,
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

        this.dispatchEvent(
          new CustomEvent("shiftPressed", {
            detail: {
              shiftPressed: this.shiftPressed,
            },
          })
        );
      }
    });

    document.addEventListener("keyup", (event) => {
      if (this.shiftPressed && !event.shiftKey) {
        this.shiftPressed = false;

        this.dispatchEvent(
          new CustomEvent("shiftReleased", {
            detail: {
              shiftPressed: this.shiftPressed,
            },
          })
        );
      }
    });
  }
}
