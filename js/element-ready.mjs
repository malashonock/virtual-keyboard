/**
 * MIT Licensed
 * Author: jwilson8767
 * Based on source code from: https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e
 *
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param selector
 * @returns {Promise}
 */
export default function elementReady(root, selector) {
  return new Promise((resolve) => {
    const element = root.querySelector(selector);
    if (element) {
      resolve(element);
    }

    const observer = new MutationObserver((mutations) => {
      // Query for elements matching the specified selector
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode.matches(selector)) {
            resolve(addedNode);
            // Once we have resolved we don't need the observer anymore
            observer.disconnect();
          }
        });
      });
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });
}
