/* eslint-disable import/extensions */
import Component from './component.mjs';
import loadJsonAsync from './loadJsonAsync.mjs';
import Key from './key.mjs';

export default class Keyboard extends EventTarget {
  element = null;

  layout = [];

  keys = [];

  #shiftPressed = false;

  #capsLockOn = false;

  #altPressed = false;

  #ctrlPressed = false;

  #metaPressed = false;

  constructor(parent) {
    super();

    this.language = localStorage.getItem('keyboardLanguage') || 'en';
    this.parent = parent || document.body;

    this.loadLayout()
      .then(() => this.render())
      .then(() => this.#addEventListeners());
  }

  get capsLockOn() {
    return this.#capsLockOn;
  }

  set capsLockOn(value) {
    if (this.#capsLockOn !== value) {
      this.#capsLockOn = value;

      this.dispatchEvent(
        new CustomEvent('capsLockChanged', {
          detail: {
            capsLockOn: this.#capsLockOn,
          },
        }),
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
        new CustomEvent('shiftChanged', {
          detail: {
            shiftPressed: this.#shiftPressed,
          },
        }),
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
        new CustomEvent('altChanged', {
          detail: {
            altPressed: this.#altPressed,
          },
        }),
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
        new CustomEvent('ctrlChanged', {
          detail: {
            ctrlPressed: this.#ctrlPressed,
          },
        }),
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
        new CustomEvent('metaChanged', {
          detail: {
            metaPressed: this.#metaPressed,
          },
        }),
      );
    }
  }

  async loadLayout() {
    this.layout = await loadJsonAsync('keys.json');
  }

  updateLayout() {
    if (this.shiftPressed && this.altPressed) {
      this.language = this.language === 'en' ? 'ru' : 'en';

      localStorage.setItem('keyboardLanguage', this.language);

      this.dispatchEvent(
        new CustomEvent('keyboardLanguageChanged', {
          detail: this.language,
        }),
      );

      this.render();
    }
  }

  render() {
    if (!this.element) {
      this.element = new Component({
        classList: ['keyboard'],
        parent: this.parent,
        insertMethod: 'replace',
      });

      this.layout.forEach((row) => {
        const rowWrapper = new Component({
          classList: ['keyboard__row'],
          parent: this.element,
        });

        const rowKeys = row.map((keyConfig) => {
          let cap;
          let capsCap;
          let shiftCap;

          if (
            Object.prototype.hasOwnProperty.call(keyConfig, 'cap')
            && Object.prototype.hasOwnProperty.call(keyConfig.cap, this.language)
          ) {
            cap = keyConfig.cap[this.language];
          } else if (typeof keyConfig.cap === 'string') {
            cap = keyConfig.cap;
          }

          if (
            Object.prototype.hasOwnProperty.call(keyConfig, 'capsCap')
            && Object.prototype.hasOwnProperty.call(keyConfig.capsCap, this.language)
          ) {
            capsCap = keyConfig.capsCap[this.language];
          } else if (typeof keyConfig.capsCap === 'string') {
            capsCap = keyConfig.capsCap;
          }

          if (
            Object.prototype.hasOwnProperty.call(keyConfig, 'shiftCap')
            && Object.prototype.hasOwnProperty.call(keyConfig.shiftCap, this.language)
          ) {
            shiftCap = keyConfig.shiftCap[this.language];
          } else if (typeof keyConfig.shiftCap === 'string') {
            shiftCap = keyConfig.shiftCap;
          }

          return new Key(this, {
            code: keyConfig.code,
            cap,
            capsCap,
            shiftCap,
            capsLockOn: this.capsLockOn,
            shiftPressed: this.shiftPressed,
            altPressed: this.altPressed,
            ctrlPressed: this.ctrlPressed,
            metaPressed: this.metaPressed,
          });
        });

        rowKeys.forEach((key) => {
          rowWrapper.append(key.element);
          this.keys.push(key);
        });
      });
    } else {
      this.layout.forEach((row) => {
        row.forEach((keyConfig) => {
          const key = this.keys.find((keyObj) => keyObj.code === keyConfig.code);
          let cap;
          let capsCap;
          let shiftCap;

          if (
            Object.prototype.hasOwnProperty.call(keyConfig, 'cap')
            && Object.prototype.hasOwnProperty.call(keyConfig.cap, this.language)
          ) {
            cap = keyConfig.cap[this.language];
          } else if (typeof keyConfig.cap === 'string') {
            cap = keyConfig.cap;
          }

          if (
            Object.prototype.hasOwnProperty.call(keyConfig, 'capsCap')
            && Object.prototype.hasOwnProperty.call(keyConfig.capsCap, this.language)
          ) {
            capsCap = keyConfig.capsCap[this.language];
          } else if (typeof keyConfig.capsCap === 'string') {
            capsCap = keyConfig.capsCap;
          }

          if (
            Object.prototype.hasOwnProperty.call(keyConfig, 'shiftCap')
            && Object.prototype.hasOwnProperty.call(keyConfig.shiftCap, this.language)
          ) {
            shiftCap = keyConfig.shiftCap[this.language];
          } else if (typeof keyConfig.shiftCap === 'string') {
            shiftCap = keyConfig.shiftCap;
          }

          key.cap = cap;
          key.capsCap = capsCap;
          key.shiftCap = shiftCap;
          key.capsLockOn = this.capsLockOn;
          key.shiftPressed = this.shiftPressed;
          key.altPressed = this.altPressed;
          key.ctrlPressed = this.ctrlPressed;
          key.metaPressed = this.metaPressed;

          key.render();
        });
      });
    }
  }

  #addEventListeners() {
    document.addEventListener('keydown', (event) => {
      Keyboard.#preventDefaultKeyActions(event);
      this.#syncModifierStates(event);
      this.#emitMouseEvent(event, 'mousedown');
    });

    document.addEventListener('keyup', (event) => {
      this.#syncModifierStates(event);
      this.#toggleCapsLock(event);
      this.#emitMouseEvent(event, 'mouseup');
    });
  }

  static #preventDefaultKeyActions(keyboardEvent) {
    if (!keyboardEvent.code.match(/F\d{1,2}/)) {
      keyboardEvent.preventDefault();
    }
  }

  #syncModifierStates(keyboardEvent) {
    if (!keyboardEvent.repeat) {
      this.shiftPressed = keyboardEvent.shiftKey;
      this.altPressed = keyboardEvent.altKey;
      this.ctrlPressed = keyboardEvent.ctrlKey;
      this.metaPressed = keyboardEvent.metaKey;
    }
  }

  #toggleCapsLock(keyboardEvent) {
    if (keyboardEvent.code === 'CapsLock') {
      this.capsLockOn = !this.capsLockOn;
    }
  }

  #emitMouseEvent(keyboardEvent, mouseEventType) {
    if (keyboardEvent.isTrusted) {
      const key = this.element.querySelector(`#${keyboardEvent.code}`);
      const event = new MouseEvent(mouseEventType, { bubbles: true });
      key?.dispatchEvent(event);
    }
  }
}
