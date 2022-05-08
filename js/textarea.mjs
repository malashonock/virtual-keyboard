import { Component } from "./utilities.mjs";

export class Textarea extends EventTarget {
  constructor(parent) {
    super();

    this.parent = parent || document.body;

    this.render();
    this.#addEventListeners();
  }

  render() {
    if (!this.element) {
      this.element = new Component({
        tag: "textarea",
        classList: ["textarea"],
        attributes: [
          {
            name: "rows",
            value: "5",
          },
        ],
        parent: this.parent,
        insertMethod: "replace",
      });
    } else {
    }
  }

  #addEventListeners() {
    document.addEventListener("keydown", (event) => {
      this.#syncTextarea(event);
    });

    document.addEventListener("keyup", (event) => {
      this.#focus(event);
    });
  }

  #focus(keyboardEvent) {
    this.element.focus();
  }

  #syncTextarea(keyboardEvent) {
    this.#focus();

    const currentStart = this.element.selectionStart;
    const currentEnd = this.element.selectionEnd;

    const startShiftedBackward = Math.max(0, currentStart - 1);
    const startShiftedForward = Math.min(
      this.element.textLength,
      currentStart + 1
    );

    const endShiftedBackward = Math.max(0, currentEnd - 1);
    const endShiftedForward = Math.min(this.element.textLength, currentEnd + 1);

    let newStart;
    let newEnd;

    switch (keyboardEvent.code) {
      case "Backspace":
        newStart =
          currentEnd === currentStart ? startShiftedBackward : currentStart;
        this.element.setRangeText("", newStart, currentEnd);
        // this.element.value = this.element.value.slice(0, -1);
        break;

      case "Tab":
        this.#insertText("\t");
        break;

      case "Enter":
        this.#insertText("\n");
        break;

      case "Delete":
        newEnd = currentEnd === currentStart ? endShiftedForward : currentEnd;
        this.element.setRangeText("", currentStart, newEnd);
        break;

      case "ArrowLeft":
        if (!keyboardEvent.shiftKey) {
          if (currentEnd === currentStart) {
            // If no text is selected, move cursor by 1 char to the left
            this.element.selectionStart = Math.max(0, currentStart - 1);
          }
          // Deselect text, if any
          this.element.selectionEnd = this.element.selectionStart;
        } else {
          // Shift is pressed
          if (
            this.element.selectionDirection === "forward" &&
            currentEnd > currentStart
          ) {
            // if selection is pointed forward, move selection end to the left
            newEnd = endShiftedBackward;
            this.element.setSelectionRange(currentStart, newEnd, "forward");
          } else {
            // if no text is selected, or selection is pointed backwards, move selection start to the left
            newStart = startShiftedBackward;
            this.element.setSelectionRange(newStart, currentEnd, "backward");
          }
        }
        break;

      case "ArrowRight":
        if (!keyboardEvent.shiftKey) {
          if (currentEnd === currentStart) {
            // If no text is selected, move cursor by 1 char to the right
            this.element.selectionEnd = endShiftedForward;
          }
          // Deselect text, if any
          this.element.selectionStart = this.element.selectionEnd;
        } else {
          // Shift is pressed
          if (
            this.element.selectionDirection === "backward" &&
            currentEnd > currentStart
          ) {
            // if selection is pointed backward, move selection start to the right
            newStart = startShiftedForward;
            this.element.setSelectionRange(newStart, currentEnd, "backward");
          } else {
            // if no text is selected, or selection is pointed forward, move selection end to the right
            newEnd = endShiftedForward;
            this.element.setSelectionRange(currentStart, newEnd, "forward");
          }
        }
        break;

      case "ArrowUp":
        const arrowUp = document.createElement("div");
        arrowUp.innerHTML = "&#8593;";
        this.#insertText(arrowUp.innerHTML);
        arrowUp.remove();
        break;

      case "ArrowDown":
        const arrowDown = document.createElement("div");
        arrowDown.innerHTML = "&#8595;";
        this.#insertText(arrowDown.innerHTML);
        arrowDown.remove();
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

      case "Space":
        this.#insertText(" ");
        break;

      default:
        if (
          !keyboardEvent.altKey &&
          !keyboardEvent.ctrlKey &&
          !keyboardEvent.metaKey
        ) {
          if (keyboardEvent.code.match(/Digit|Key|Arrow/)) {
            this.#insertText(keyboardEvent.key);
          }
        }
        break;
    }
  }

  #insertText(text) {
    this.element.setRangeText(
      text,
      this.element.selectionStart,
      this.element.selectionEnd,
      "end"
    );
  }
}
