import Textarea from "./textarea.mjs";
import { textareaWrapper, keyboardWrapper } from "./layout.mjs";
import keyboard from "./keyboardFactory.mjs";
import elementReady from "./element-ready.mjs";

export default elementReady(keyboardWrapper, ".keyboard")
  .then(() => new Textarea(textareaWrapper, keyboard));
