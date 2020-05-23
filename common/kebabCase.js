module.exports = function kebabCase(input) {
  return input.toLowerCase().split(' ').join('-');
};
