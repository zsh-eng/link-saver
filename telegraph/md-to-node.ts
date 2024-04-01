import {
  Node,
  CharacterData,
  Element,
} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

/**
 * TelegraphNode represents a node in the format used by the Telegraph API.
 * @see {@link https://telegra.ph/api#Content-format | Content Format}
 */
type TelegraphNode =
  | {
      tag: string;
      attrs?: Record<string, string>;
      children?: TelegraphNode[];
    }
  | string
  | false;

function isTextNode(node: Node): node is CharacterData {
  return node.nodeType == node.TEXT_NODE;
}

function isElementNode(node: Node): node is Element {
  return node.nodeType == node.ELEMENT_NODE;
}

function domToNode(domNode: Node) {
  if (isTextNode(domNode)) {
    return domNode.data.trimStart();
  }

  if (!isElementNode(domNode)) {
    return false;
  }

  const nodeElement: TelegraphNode = {
    tag: domNode.tagName.toLowerCase(),
  };

  // Telegraph only has two types of headings
  switch (nodeElement.tag) {
    case 'h1':
    case 'h2':
      nodeElement.tag = 'h3';
      break;
    case 'h3':
      nodeElement.tag = 'h4';
      break;
    case 'h4':
    case 'h5':
    case 'h6':
      nodeElement.tag = 'p';
      break;
  }

  for (let i = 0; i < domNode.attributes.length; i++) {
    const attr = domNode.attributes[i];
    if (attr.name == 'href' || attr.name == 'src') {
      if (!nodeElement.attrs) {
        nodeElement.attrs = {};
      }
      nodeElement.attrs[attr.name] = attr.value;
    }
  }

  if (domNode.childNodes.length > 0) {
    nodeElement.children = [];
    for (let i = 0; i < domNode.childNodes.length; i++) {
      const childDomNode = domNode.childNodes[i];
      const childTelegraphNode = domToNode(childDomNode);
      nodeElement.children.push(childTelegraphNode);
    }
  }

  return nodeElement;
}

export function bodyToNodes(body: Node): TelegraphNode[] {
  const empty = [''];
  const node = domToNode(body);

  if (typeof node === 'string') {
    return [node];
  }

  if (node === false) {
    return empty; // Must provide content - [false] is not allowed
  }

  return node.children ?? empty;
}
