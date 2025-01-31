import type { Element } from "hast";
import type { Text } from 'hast';
 
const own = {}.hasOwnProperty;

function unknownHandler(state, node) {
  if (node.type === "element") {
    return node;
  }
  const data = node.data || {};
  const result: Element | Text =
    "value" in node &&
    !(own.call(data, "hProperties") || own.call(data, "hChildren"))
      ? { type: "text", value: node.value }
      : {
          type: "element",
          tagName: "div",
          properties: {},
          children: state.all(node),
        };

  state.patch(node, result);
  return state.applyData(node, result);
}

export default unknownHandler;
