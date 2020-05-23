const topLevelElementsMap = {
  p: 'p',
  h3: 'h2',
  h2: 'h2',
  ul: 'ul',
  li: 'li',
};

export default function processArticleBody(node) {
  // Handle Images
  if (node.kind === 'image') {
    return {
      ...node,
      aspect: getImgAspect(node.viewMode),
    };
  }
  // Handle html element from Polopoly's WYIYG editor
  if (isNestableElement(node)) {
    const tag = topLevelElementsMap[node.tag];

    return {
      kind: 'htmlString',
      tag,
      attrs: getAttrsObj(node.attributes),
      content: stringifyNestedElement(node),
    };
  }
  return node;
}

////////////////////////////////////////////////////////////////////////
//                              HELPERS                               //
////////////////////////////////////////////////////////////////////////

function isNestableElement(node) {
  const topLevelElementsWhiteList = Object.keys(topLevelElementsMap);
  return node.tag && topLevelElementsWhiteList.includes(node.tag);
}

function stringifyNestedElement(element) {
  const htmlTagMap = {
    a: 'a',
    b: 'strong',
    u: 'u',
    em: 'em',
    h3: 'h2',
    i: 'em',
    li: 'li',
    mark: 'mark',
    ol: 'ol',
    p: 'p',
    span: 'span',
    strong: 'strong',
    ul: 'ul',
  };

  if (typeof element.content === 'string') return element;

  const content = (element.content || element).reduce((elementHtmlString, node) => {
    const tag = htmlTagMap[node.tag] || node.tag;
    switch (tag) {
      case '#text':
        return elementHtmlString + node.attributes[0].value;

      // remove manual line breaks
      case 'br':
        return elementHtmlString;
        // return elementHtmlString + '<br />';

      default:
        return `${elementHtmlString}<${tag}${stringifyAttrs(node.attributes)}>${stringifyNestedElement(node.content)}</${tag}>`;
    }
  }, '');

  return content;
}

const attrWhiteList = [ /* 'class',*/ 'href', 'target', 'id', 'name', ];

function getAttrsObj(attrs) {
  if (!Array.isArray(attrs)) return {};

  return attrs.reduce((result, attr) => {
    if (attrWhiteList.includes(attr.key)) {
      // eslint-disable-next-line no-param-reassign
      result[attr.key] = attr.value;
    }

    return result;
  }, {});
}
function stringifyAttrs(attrs) {
  if (!Array.isArray(attrs)) return '';


  const attrsString = attrs.reduce((result, attr) => (attrWhiteList.includes(attr.key)
    ? `${result} ${attr.key}="${attr.value}"`
    : result), '');

  return attrsString || '';
}

function getImgAspect(viewMode) {
  switch (viewMode) {
    case 'regularModeBigImage':
      return 'regular';
    case 'EnableLargeView':
      return 'headline';
    case 'OneThirdView':
      return 'vertical';
    case 'TwoThirdView':
      return 'vertical';
    case 'landscapeView':
      return 'landscape';
    case 'squareView':
      return 'square';
    case 'VerticalView':
      return 'vertical';
    case 'FullColumnWithVerticalImage':
      return 'full';
    default:
      return 'full';
  }
}
