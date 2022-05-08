import { Textarea } from "./textarea.mjs";
import { textareaWrapper } from "./layout.mjs";
import { keyboardWrapper } from "./layout.mjs";
import { keyboard } from "./keyboardFactory.mjs";

export let textarea;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode) => {
      if (addedNode.classList.contains("keyboard")) {
        textarea = new Textarea(textareaWrapper, keyboard);
        observer.disconnect();
      }
    });
  });
});

observer.observe(keyboardWrapper, { childList: true });
