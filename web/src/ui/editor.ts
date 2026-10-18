// The code editor (CodeMirror 6) behind a small interface, so that the lesson blocks can be tested with a plain text
// box. Tab indents, which would trap keyboard users: Escape first makes the next Tab move on (stated under each editor).
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";

export interface Editor {
  get(): string;
  set(kod: string): void;
  focus(): void;
  destroy(): void;
}

export interface EditorValj {
  kod: string;
  etikett: string;
  skrivskyddad?: boolean;
  onChange?: (kod: string) => void;
}

export type EditorFabrik = (foralder: HTMLElement, valj: EditorValj) => Editor;

const farger = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--syn-nyckelord)", fontWeight: "600" },
  { tag: [tags.string, tags.special(tags.string)], color: "var(--syn-text)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--syn-tal)" },
  { tag: tags.comment, color: "var(--syn-kommentar)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], color: "var(--syn-funktion)" },
]);

export const skapaCodeMirror: EditorFabrik = (foralder, valj) => {
  let tabFlyttarFokus = false;
  const view = new EditorView({
    parent: foralder,
    state: EditorState.create({
      doc: valj.kod,
      extensions: [
        lineNumbers(),
        history(),
        python(),
        indentUnit.of("    "),
        syntaxHighlighting(farger),
        EditorState.readOnly.of(Boolean(valj.skrivskyddad)),
        EditorView.contentAttributes.of({ "aria-label": valj.etikett, "aria-multiline": "true" }),
        keymap.of([
          { key: "Escape", run: () => ((tabFlyttarFokus = true), false) },
          { key: "Tab", run: (v) => (tabFlyttarFokus ? ((tabFlyttarFokus = false), false) : indentWithTab.run?.(v) ?? false), shift: (v) => (tabFlyttarFokus ? false : indentWithTab.shift?.(v) ?? false) },
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            tabFlyttarFokus = false;
            valj.onChange?.(u.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { backgroundColor: "var(--editor-bg)", color: "var(--fg)", fontSize: "1rem" },
          ".cm-content": { fontFamily: 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace', caretColor: "var(--fg)" },
          ".cm-gutters": { backgroundColor: "var(--editor-bg)", color: "var(--muted)", border: "none" },
          "&.cm-focused": { outline: "3px solid var(--accent)" },
        }),
      ],
    }),
  });
  return {
    get: () => view.state.doc.toString(),
    set: (kod) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: kod } }),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
};
