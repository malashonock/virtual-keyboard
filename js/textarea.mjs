import Component from "./component.mjs";

export default class Textarea extends EventTarget {
  constructor(parent, keyboard) {
    super();

    this.parent = parent || document.body;

    this.keyboard = keyboard;

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
    }
  }

  #addEventListeners() {
    this.keyboard.element.addEventListener("mousedown", (event) => {
      this.#syncTextarea(event);
    });

    this.keyboard.element.addEventListener("mouseup", () => {
      this.#focus();
    });

    this.keyboard.element.addEventListener("mouseover", () => {
      this.#focus();
    });
  }

  #focus() {
    this.element.focus();
  }

  #syncTextarea(event) {
    if (!event.target.classList.contains("keyboard__key")) {
      return;
    }

    const keyElement = event.target;
    const key = this.keyboard.keys.find((keyObj) => keyObj.code === keyElement.id);

    this.#focus();

    const currentStart = this.element.selectionStart;
    const currentEnd = this.element.selectionEnd;

    const startShiftedBackward = Math.max(0, currentStart - 1);
    const startShiftedForward = Math.min(
      this.element.textLength,
      currentStart + 1,
    );

    const endShiftedBackward = Math.max(0, currentEnd - 1);
    const endShiftedForward = Math.min(this.element.textLength, currentEnd + 1);

    let newStart;
    let newEnd;

    switch (key.code) {
      case "Backspace":
        newStart = currentEnd === currentStart ? startShiftedBackward : currentStart;
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
        if (!key.shiftPressed) {
          if (currentEnd === currentStart) {
            // If no text is selected, move cursor by 1 char to the left
            this.element.selectionStart = Math.max(0, currentStart - 1);
          }
          // Deselect text, if any
          this.element.selectionEnd = this.element.selectionStart;
        } else if (
          this.element.selectionDirection === "forward"
          && currentEnd > currentStart
        ) {
          // if selection is pointed forward, move selection end to the left
          newEnd = endShiftedBackward;
          this.element.setSelectionRange(currentStart, newEnd, "forward");
        } else {
          // if no text is selected, or selection is pointed backwards,
          // move selection start to the left
          newStart = startShiftedBackward;
          this.element.setSelectionRange(newStart, currentEnd, "backward");
        }
        break;

      case "ArrowRight":
        if (!key.shiftPressed) {
          if (currentEnd === currentStart) {
            // If no text is selected, move cursor by 1 char to the right
            this.element.selectionEnd = endShiftedForward;
          }
          // Deselect text, if any
          this.element.selectionStart = this.element.selectionEnd;
        } else if (
          this.element.selectionDirection === "backward"
          && currentEnd > currentStart
        ) {
          // if selection is pointed backward, move selection start to the right
          newStart = startShiftedForward;
          this.element.setSelectionRange(newStart, currentEnd, "backward");
        } else {
          // if no text is selected, or selection is pointed forward,
          // move selection end to the right
          newEnd = endShiftedForward;
          this.element.setSelectionRange(currentStart, newEnd, "forward");
        }
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
        if (!key.altPressed && !key.ctrlPressed && !key.metaPressed) {
          this.#insertText(keyElement.innerHTML);
        }
        break;
    }
  }

  #insertText(text) {
    this.element.setRangeText(
      text,
      this.element.selectionStart,
      this.element.selectionEnd,
      "end",
    );
  }
}
