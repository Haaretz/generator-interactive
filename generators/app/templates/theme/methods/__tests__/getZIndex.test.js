import getZIndex from '../getZIndex';

const indices = {
  modal: 100000,
  foo: {
    base: 100,
    bar: 200,
  },
};

describe('getZIndex', () => {
  it('return correct value of single-level named index when passing a string', () => {
    expect(getZIndex('modal', undefined, indices)).toBe(`${indices.modal}`);
  });
  it('return "base" value of nested-level named index when passing a string', () => {
    expect(getZIndex('foo', undefined, indices)).toBe(`${indices.foo.base}`);
  });
  it('return value of nested-level named index when passing an array', () => {
    expect(getZIndex([ 'foo', 'bar', ], undefined, indices)).toBe(
      `${indices.foo.bar}`
    );
  });

  it('change value by offset when using a string', () => {
    expect(getZIndex('modal', 1, indices)).toBe(`${indices.modal + 1}`);
    expect(getZIndex('modal', -1, indices)).toBe(`${indices.modal - 1}`);
  });

  describe('errors', () => {
    it('throw when level is a string that does not match a named level', () => {
      expect(() => getZIndex('blah', undefined, indices)).toThrow(
        '"blah" isn\'t a named z-index level'
      );
    });
    it('throw when first item in level array does not match a named level', () => {
      expect(() => getZIndex([ 'baz', 'qua', ], undefined, indices)).toThrow(
        '"baz.qua" isn\'t a named z-index level'
      );
    });
    it('throw when second item in level array does not match a named level', () => {
      expect(() => getZIndex([ 'foo', 'qua', ], undefined, indices)).toThrow(
        '"foo.qua" isn\'t a named z-index level'
      );
    });
  });
});
