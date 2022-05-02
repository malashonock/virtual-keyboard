import { Component } from "./_utilities.mjs";
import { loadJsonAsync } from "./_loadJsonAsync.mjs";
import { Key } from "./_key.mjs";

export class Keyboard extends EventTarget {
  element = null;

  constructor(parent) {
    super();

    this.language = localStorage.getItem("keyboardLanguage") || "en";
    this.parent = parent || document.body;

    this.render();

    this.addEventListeners();
  }

  async render() {
    this.element = new Component({
      classList: ["keyboard"],
      parent: this.parent,
    });

    const keyboardLayouts = await loadJsonAsync("keys.json");
    const keyboardLayout = keyboardLayouts[this.language];

    for (const row of keyboardLayout) {
      const rowWrapper = new Component({
        classList: ["keyboard__row"],
        parent: this.element,
      });

      const rowKeys = row.map(
        (key) =>
          new Key(this.element, {
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
      }
    });
  }
}
