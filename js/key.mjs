import { Component } from "./utilities.mjs";

export class Key extends EventTarget {
  element = null;
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
    this.parent.addEventListener("capsLockChanged", (event) => {
      this.capsLockOn = event.detail.capsLockOn;
    });

    this.parent.addEventListener("shiftChanged", (event) => {
      this.shiftPressed = event.detail.shiftPressed;
    });

    this.parent.addEventListener("altChanged", (event) => {
      this.altPressed = event.detail.altPressed;
    });

    this.parent.addEventListener("ctrlChanged", (event) => {
      this.ctrlPressed = event.detail.ctrlPressed;
    });

    this.parent.addEventListener("metaChanged", (event) => {
      this.metaPressed = event.detail.metaPressed;
    });

    this.element.addEventListener("mousedown", (event) => {
      this.element.classList.add("clicked");

      const textarea = document.querySelector(".textarea");
      textarea.focus();

      const currentStart = textarea.selectionStart;
      const currentEnd = textarea.selectionEnd;

      const startShiftedBackward = Math.max(0, currentStart - 1);
      const startShiftedForward = Math.min(
        textarea.textLength,
        currentStart + 1
      );

      const endShiftedBackward = Math.max(0, currentEnd - 1);
      const endShiftedForward = Math.min(textarea.textLength, currentEnd + 1);

      let newStart;
      let newEnd;

      switch (this.code) {
        case "Backspace":
          newStart =
            currentEnd === currentStart ? startShiftedBackward : currentStart;
          textarea.setRangeText("", newStart, currentEnd);
          // textarea.value = textarea.value.slice(0, -1);
          break;

        case "Tab":
          textarea.value += "\t";
          break;

        case "Enter":
          textarea.value += "\n";
          break;

        case "Delete":
          newEnd = currentEnd === currentStart ? endShiftedForward : currentEnd;
          textarea.setRangeText("", currentStart, newEnd);
          break;

        case "ArrowLeft":
          if (!this.shiftPressed) {
            if (currentEnd === currentStart) {
              // If no text is selected, move cursor by 1 char to the left
              textarea.selectionStart = Math.max(0, currentStart - 1);
            }
            // Deselect text, if any
            textarea.selectionEnd = textarea.selectionStart;
          } else {
            // Shift is pressed
            if (
              textarea.selectionDirection === "forward" &&
              currentEnd > currentStart
            ) {
              // if selection is pointed forward, move selection end to the left
              newEnd = endShiftedBackward;
              textarea.setSelectionRange(currentStart, newEnd, "forward");
            } else {
              // if no text is selected, or selection is pointed backwards, move selection start to the left
              newStart = startShiftedBackward;
              textarea.setSelectionRange(newStart, currentEnd, "backward");
            }
          }
          break;

        case "ArrowRight":
          if (!this.shiftPressed) {
            if (currentEnd === currentStart) {
              // If no text is selected, move cursor by 1 char to the right
              textarea.selectionEnd = endShiftedForward;
            }
            // Deselect text, if any
            textarea.selectionStart = textarea.selectionEnd;
          } else {
            // Shift is pressed
            if (
              textarea.selectionDirection === "backward" &&
              currentEnd > currentStart
            ) {
              // if selection is pointed backward, move selection start to the right
              newStart = startShiftedForward;
              textarea.setSelectionRange(newStart, currentEnd, "backward");
            } else {
              // if no text is selected, or selection is pointed forward, move selection end to the right
              newEnd = endShiftedForward;
              textarea.setSelectionRange(currentStart, newEnd, "forward");
            }
          }
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
          if (
            !this.shiftPressed &&
            !this.altPressed &&
            !this.ctrlPressed &&
            !this.metaPressed
          ) {
            textarea.value += this.element.innerHTML;
          }
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
