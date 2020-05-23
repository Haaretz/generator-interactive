const dataAttrs = {};

export function setDataAttributes(attributes) {
  Object.entries(attributes).forEach(([ attribute, value, ]) => {
    if (value != null) dataAttrs[`data-${attribute}`] = value;
  });
}

export function generateDataAttributes() {
  return dataAttrs;
}
