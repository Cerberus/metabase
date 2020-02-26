import {
  parse,
  defaultParser,
  fallbackParser,
  serialize,
} from "metabase/lib/expressions/syntax";

import {
  shared,
  aggregationOpts,
  expressionOpts,
} from "./__support__/expressions";

describe("metabase/lib/expressions/syntax", () => {
  describe("parse()", () => {
    for (const [name, cases, opts] of shared) {
      describe(name, () => {
        for (const [source, mbql, description] of cases) {
          if (mbql) {
            it(`should parse with defaultParser ${description}`, () => {
              const tree = defaultParser(source, opts);
              expect(serialize(tree)).toEqual(source);
            });
            it(`should parser with fallbackParser ${description}`, () => {
              const tree = fallbackParser(source, opts);
              expect(serialize(tree)).toEqual(source);
            });
          }
        }
      });
    }

    // NOTE: only add tests below for things that don't fit the shared test cases above

    it(`should parse and serialize source with leading whitespace`, () => {
      const source = " Sum(A)";
      const tree = parse(source, aggregationOpts);
      expect(serialize(tree)).toEqual(source);
    });
    it(`should parse and serialize source with trailing whitespace`, () => {
      const source = "Sum(A) ";
      const tree = parse(source, aggregationOpts);
      expect(serialize(tree)).toEqual(source);
    });
    xdescribe("recovery = true", () => {
      it("should parse missing quote at the end", () => {
        const source = '1 + "Total';
        const tree = parse(source, {
          ...expressionOpts,
          recover: true,
        });
        expect(serialize(tree)).toEqual(source);
      });
      it("should parse missing paren at the end", () => {
        const source = "1 + (2 + 3)";
        const tree = parse(source, {
          ...expressionOpts,
          recover: true,
        });
        expect(serialize(tree)).toEqual(source);
      });
      xit("should parse missing quote in the middle", () => {
        const source = 'Sum("Total)';
        const tree = parse(source, {
          ...aggregationOpts,
          recover: true,
        });
        expect(serialize(tree)).toEqual(source);
      });
    });
    xdescribe("recovery = false", () => {
      it("should not parse missing quote at the end", () => {
        const source = '1 + "Total';
        expect(() => {
          const tree = parse(source, {
            ...expressionOpts,
            recover: false,
          });
        }).toThrow();
      });
    });
  });
});
