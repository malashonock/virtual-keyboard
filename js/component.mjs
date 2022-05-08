export default function Component(props) {
  const element = document.createElement(props.tag || "div");

  if (props.id) {
    element.id = props.id || "";
  }

  element.classList.add(...(props.classList || []));

  element.innerHTML = props.innerHTML || "";

  props.attributes?.forEach((attribute) => {
    element.setAttribute(attribute.name, attribute.value);
  });

  const parent = props.parent || document.body;
  const insertMethod = props.insertMethod || "append";

  switch (insertMethod) {
    case "append":
      parent.append(element);
      break;
    case "prepend":
      parent.prepend(element);
      break;
    case "replace":
      parent.replaceChildren(element);
      break;
    default:
      throw Error("Insertion method not recognized.");
  }

  return element;
}
