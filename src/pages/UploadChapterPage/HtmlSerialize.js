import escapeHTML from "escape-html";
import { Text } from "slate";

export const serializeContent = (nodes) => {
  return nodes.map((node) => serialize(node)).join("");
};

const serialize = (node) => {
  if (Text.isText(node)) {
    let string = escapeHTML(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    return string;
  }

  const children = node.children.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHTML(node.url)}">${children}</a>`;
    case "image":
      return `<img src="${escapeHTML(node.url)}" alt="${escapeHTML(node.alt)}" />`;
    default:
      return children;
  }
};
