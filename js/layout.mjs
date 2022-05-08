import { Component } from "./utilities.mjs";

export const container = new Component({
  classList: ["container"],
  parent: document.body,
  insertMethod: "prepend",
});

const header = new Component({
  tag: "header",
  classList: ["header"],
  innerHTML: "Virtual keyboard",
  parent: container,
});

const main = new Component({
  tag: "main",
  classList: ["main"],
  parent: container,
});

export const textareaWrapper = new Component({
  classList: ["textarea-wrapper"],
  parent: main,
});

export const keyboardWrapper = new Component({
  classList: ["keyboard-wrapper"],
  parent: main,
});

const notes = new Component({
  classList: ["notes"],
  parent: main,
});

const osDisclaimer = new Component({
  tag: "p",
  classList: ["notes__note"],
  id: "os-disclaimer",
  innerHTML: "This virtual keyboard was developed on Windows.",
  parent: notes,
});

const switchLangHotkey = new Component({
  tag: "p",
  classList: ["notes__note"],
  id: "switch-lang-hotkey",
  innerHTML:
    "To switch between English and Russian layouts, press left <strong>Shift + Alt</strong>",
  parent: notes,
});
