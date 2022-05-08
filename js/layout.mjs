import Component from "./component.mjs";

export const container = new Component({
  classList: ["container"],
  parent: document.body,
  insertMethod: "prepend",
});

export const header = new Component({
  tag: "header",
  classList: ["header"],
  innerHTML: "Virtual keyboard",
  parent: container,
});

export const main = new Component({
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

export const notes = new Component({
  classList: ["notes"],
  parent: main,
});

export const osDisclaimer = new Component({
  tag: "p",
  classList: ["notes__note"],
  id: "os-disclaimer",
  innerHTML: "This virtual keyboard was developed on Windows.",
  parent: notes,
});

export const switchLangHotkey = new Component({
  tag: "p",
  classList: ["notes__note"],
  id: "switch-lang-hotkey",
  innerHTML:
    "To switch between English and Russian layouts, press left <strong>Shift + Alt</strong>",
  parent: notes,
});
