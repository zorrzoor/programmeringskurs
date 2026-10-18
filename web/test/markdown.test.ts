import { describe, expect, test } from "vitest";
import { inline, renderaMarkdown } from "../src/markdown.ts";

const html = (md: string) => {
  const d = document.createElement("div");
  d.append(renderaMarkdown(md));
  return d.innerHTML;
};

describe("renderaMarkdown", () => {
  test("paragraphs, headings and inline formatting", () => {
    expect(html("## Prova\n\nEn **fet** och *kursiv* rad med `kod`.\nOch en till.")).toBe(
      "<h2>Prova</h2><p>En <strong>fet</strong> och <em>kursiv</em> rad med <code>kod</code>. Och en till.</p>",
    );
  });
  test("lists and quotes", () => {
    expect(html("- ett\n- två\n\n1. a\n2. b\n\n> citat\n> mer")).toBe("<ul><li>ett</li><li>två</li></ul><ol><li>a</li><li>b</li></ol><blockquote>citat mer</blockquote>");
  });
  test("code blocks keep their text exactly", () => {
    expect(html("```python\nif x:\n    print(1)\n```")).toBe('<pre class="kod"><code>if x:\n    print(1)</code></pre>');
  });
  test("nothing becomes markup: HTML in the text is shown as text", () => {
    const out = html("Hej <img src=x onerror=alert(1)> och <script>x</script>");
    expect(out).not.toContain("<img");
    expect(out).not.toContain("<script");
    expect(out).toContain("&lt;img");
  });
  test("links only to the course and https; others are plain text", () => {
    expect(html("[ordlista](#/ordlista) [ok](https://example.org/a)")).toBe('<p><a href="#/ordlista">ordlista</a> <a href="https://example.org/a">ok</a></p>');
    const bad = html("[x](javascript:alert(1)) [y](http://example.org)");
    expect(bad).not.toContain("href");
    expect(bad).toContain("x");
  });
  test("a list item can contain inline formatting; unmatched markers stay as text", () => {
    expect(html("- **fet** i listan\n\n2 * 3 = 6 och a*b")).toBe("<ul><li><strong>fet</strong> i listan</li></ul><p>2 * 3 = 6 och a*b</p>");
  });
  test("inline() returns nodes", () => {
    expect(inline("a `b` c")).toHaveLength(3);
  });
});
