import { DomHandler, Parser } from "htmlparser2";

export function splitContent(content, wordsPerPage) {
  if (!content || typeof content !== "string") {
    console.error("Invalid content provided to splitContent");
    return [];
  }

  const handler = new DomHandler((error, dom) => {
    if (error) {
      console.error("Error parsing content:", error);
      return [];
    }
  });
  const parser = new Parser(handler);

  try {
    parser.write(content);
    parser.done();
  } catch (error) {
    console.error("Error during parsing:", error);
    return [];
  }

  const dom = handler.dom;
  const pages = [];
  let currentPage = "";
  let currentWordCount = 0;

  const traverseDom = (nodes) => {
    nodes.forEach((node) => {
      if (node.type === "text") {
        const words = node.data.split(" ");
        words.forEach((word) => {
          if (currentWordCount + word.length > wordsPerPage) {
            pages.push(currentPage.trim());
            currentPage = "";
            currentWordCount = 0;
          }
          currentPage += word + " ";
          currentWordCount += word.length;
        });
      } else if (node.type === "tag") {
        if (node.name === "img") {
          if (currentPage) {
            pages.push(currentPage.trim());
            currentPage = "";
            currentWordCount = 0;
          }
          let imgTag = `<${node.name}`;
          if (node.attribs) {
            Object.keys(node.attribs).forEach((attr) => {
              imgTag += ` ${attr}="${node.attribs[attr]}"`;
            });
          }
          imgTag += ">";
          pages.push(imgTag);
        } else {
          currentPage += `<${node.name}`;
          if (node.attribs) {
            Object.keys(node.attribs).forEach((attr) => {
              currentPage += ` ${attr}="${node.attribs[attr]}"`;
            });
          }
          currentPage += ">";
          traverseDom(node.children);
          currentPage += `</${node.name}>`;
        }
      }
    });
  };

  traverseDom(dom);

  if (currentPage) {
    pages.push(currentPage.trim());
  }

  return pages;
}
