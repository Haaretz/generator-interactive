import { clearActivatedColors, colorFunctionsFactory } from "../color";

const testPalette = {
  transparent: {
    default: "rgba(0,0,0,0)",
    darkMode: "hsla(0,0,0,0)",
  },
  neutral: {
    "-1": {
      default: "#2D2D2D",
      darkMode: "#CCC",
    },
    base: {
      default: "#222",
      darkMode: "#EBEBEB",
    },
    1: {
      default: "#161616",
      darkMode: "#F5F5F5",
    },
  },

  highlight: {
    default: ["transparent"],
    darkMode: ["transparent"],
  },
  test: {
    default: ["neutral"],
    darkMode: ["neutral", "-1"],
  },
  primaryButton: {
    backgroundColor: {
      default: ["transparent"],
      darkMode: ["neutral", "-1"],
    },
    border: {
      default: ["neutral", "1"],
      darkMode: ["neutral"],
    },
  },
};

const {
  getColor,
  generateColorCustomProps,
} = colorFunctionsFactory(testPalette, ["default", "darkMode"]);

describe("color functions", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    clearActivatedColors();
  });

  describe("base colors", () => {
    describe("base color with no variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("transparent");
        expect(result).toBe("var(--color-transparent)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("transparent");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
                  ":root{
                    --color-transparent:rgba(0,0,0,0);
                  }
                  .darkMode{
                    --color-transparent:hsla(0,0,0,0);
                  }
                  "
              `);
      });
    });
    describe("default variant in color with variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("neutral");
        expect(result).toBe("var(--color-neutral)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("neutral");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
                  ":root{
                    --color-neutral:#222;
                  }
                  .darkMode{
                    --color-neutral:#EBEBEB;
                  }
                  "
              `);
      });
    });
    describe("non default variant in color with variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("neutral", "-1");
        expect(result).toBe("var(--color-neutral--1)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("neutral", "+1");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
                  ":root{
                    --color-neutral-1:#161616;
                  }
                  .darkMode{
                    --color-neutral-1:#F5F5F5;
                  }
                  "
              `);
      });
    });
    describe("nonexistent colors and variants", () => {
      it("throw when calling nonexistent color", () => {
        expect.assertions(1);
        expect(() => {
          getColor("undefined");
        }).toThrow('"undefined" doesn\'t exist in the color palette');
      });
      it("throw when calling nonexistent variant", () => {
        expect.assertions(1);
        expect(() => {
          getColor("neutral", "undefined");
        }).toThrow('"neutral.undefined" doesn\'t exist in the color palette');
      });
    });
  });
  describe("aliases", () => {
    describe("alias to color without variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("highlight");
        expect(result).toBe("var(--color-highlight)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("highlight");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
          ":root{
            --color-transparent:transparent;
            --color-transparent:transparent;
            --color-highlight:var(--color-transparent);
          }
          .darkMode{
            --color-transparent:transparent;
            --color-transparent:transparent;
            --color-highlight:var(--color-transparent);
          }
          "
        `);
      });
    });
    describe("alias to color with variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("test");
        expect(result).toBe("var(--color-test)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("test");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
          ":root{
            --color-neutral--1:#2D2D2D;
            --color-neutral:neutral;
            --color-test:var(--color-neutral);
          }
          .darkMode{
            --color-neutral--1:#CCC;
            --color-neutral:neutral,-1;
            --color-test:var(--color-neutral--1);
          }
          "
        `);
      });
    });
    describe("alias with variants to color without variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("primaryButton", "backgroundColor");
        expect(result).toBe("var(--color-primaryButton-backgroundColor)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("primaryButton", "backgroundColor");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
          ":root{
            --color-neutral--1:#2D2D2D;
            --color-primaryButton-backgroundColor:var(--color-transparent);
          }
          .darkMode{
            --color-neutral--1:#CCC;
            --color-primaryButton-backgroundColor:var(--color-neutral--1);
          }
          "
        `);
      });
    });
    describe("alias with variants to color with variants", () => {
      it('return correct custom prop from "getColor"', () => {
        expect.assertions(1);
        const result = getColor("primaryButton", "border");
        expect(result).toBe("var(--color-primaryButton-border)");
      });
      it('generate correct custom props from "generateColorCustomProps"', () => {
        expect.assertions(1);
        getColor("primaryButton", "border");
        const result = formatCss(generateColorCustomProps());
        expect(result).toMatchInlineSnapshot(`
          ":root{
            --color-neutral-1:#161616;
            --color-primaryButton-border:var(--color-neutral-1);
          }
          .darkMode{
            --color-neutral-1:#F5F5F5;
            --color-primaryButton-border:var(--color-neutral);
          }
          "
        `);
      });
    });
  });

  it("don't override previously activiated colors", () => {
    expect.assertions(1);

    getColor("highlight");
    getColor("neutral");
    getColor("neutral", "-1");
    getColor("neutral", "-1");
    getColor("neutral", "-1");
    getColor("primaryButton", "backgroundColor");
    getColor("primaryButton", "border");
    getColor("test");
    getColor("transparent");

    const result = formatCss(generateColorCustomProps());
    expect(result).toMatchInlineSnapshot(`
      ":root{
        --color-transparent:rgba(0,0,0,0);
        --color-neutral-1:#161616;
        --color-neutral--1:#2D2D2D;
        --color-neutral:#222;
        --color-highlight:var(--color-transparent);
        --color-primaryButton-backgroundColor:var(--color-transparent);
        --color-primaryButton-border:var(--color-neutral-1);
        --color-test:var(--color-neutral);
      }
      .darkMode{
        --color-transparent:hsla(0,0,0,0);
        --color-neutral-1:#F5F5F5;
        --color-neutral--1:#CCC;
        --color-neutral:#EBEBEB;
        --color-highlight:var(--color-transparent);
        --color-primaryButton-backgroundColor:var(--color-neutral--1);
        --color-primaryButton-border:var(--color-neutral);
        --color-test:var(--color-neutral--1);
      }
      "
    `);
  });
});

function formatCss(cssString) {
  return cssString
    .split("{")
    .join("{\n")
    .split(";")
    .join(";\n")
    .split(/(?<!\()--(?=\D)/)
    .join("  --")
    .split("}")
    .join("}\n");
}
