import { describe, expect, test } from "vitest";
import { forklaraFel } from "../src/py/felmeddelanden.ts";
import { h, kodtext } from "../src/ui/dom.ts";

const html = (text: string) => h("p", {}, ...kodtext(text)).innerHTML;

describe("kodtext", () => {
  test("turns backticks into <code>", () => {
    expect(html("Python hittar inget som heter `Hej`.")).toBe("Python hittar inget som heter <code>Hej</code>.");
    expect(html("`=` och `==`")).toBe("<code>=</code> och <code>==</code>");
  });

  test("leaves text without markers, and with an odd number of backticks, as it is", () => {
    expect(html("ingen kod här")).toBe("ingen kod här");
    expect(html("en ` ensam")).toBe("en ` ensam");
  });

  test("never makes markup of the text itself", () => {
    expect(html("`<b>x</b>`")).toBe("<code>&lt;b&gt;x&lt;/b&gt;</code>");
  });

  test("renders a real explanation without backticks left over", () => {
    const f = forklaraFel({ typ: "NameError", meddelande: "name 'Hej' is not defined", rad: 1 });
    expect(html(f.forklaring)).not.toContain("`");
    expect(html(f.forklaring)).toContain("<code>Hej</code>");
  });
});
