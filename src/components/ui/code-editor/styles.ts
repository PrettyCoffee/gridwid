import { css } from "goober"
import { CSSProperties } from "react"

export const container: CSSProperties = {
  position: "relative",
  textAlign: "left",
  boxSizing: "border-box",
  padding: 0,
  overflow: "hidden",
}

export const textarea: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  resize: "none",
  color: "inherit",
  opacity: 0.8,
  overflow: "hidden",
  MozOsxFontSmoothing: "grayscale",
  WebkitFontSmoothing: "antialiased",
  WebkitTextFillColor: "transparent",
}

export const editor: CSSProperties = {
  margin: 0,
  border: 0,
  background: "none",
  boxSizing: "inherit",
  display: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontStyle: "inherit",
  fontVariantLigatures: "inherit",
  fontWeight: "inherit",
  letterSpacing: "inherit",
  lineHeight: "inherit",
  tabSize: "inherit",
  textIndent: "inherit",
  textRendering: "inherit",
  textTransform: "inherit",
  whiteSpace: "pre-wrap",
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  outline: 0,
}

// TODO: Prefer tailwind and use theme colors
export const rehypeTheme = css`
  --color-fg-default: #c9d1d9;
  --color-canvas-subtle: #161b22;
  --color-prettylights-syntax-comment: #8b949e;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-markup-bold: #c9d1d9;

  font-family: inherit;
  font-size: 1rem;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-subtle);

  .w-tc-editor-preview {
    pre {
      margin: 0;
      padding: 0;
      white-space: inherit;
      font-family: inherit;
      font-size: inherit;
      code {
        font-family: inherit;
      }
    }
  }

  code[class*="language-"],
  pre[class*="language-"] {
    .token.cdata,
    .token.comment,
    .token.doctype,
    .token.prolog {
      color: var(--color-prettylights-syntax-comment);
    }
    .token.punctuation {
      color: var(--color-prettylights-syntax-sublimelinter-gutter-mark);
    }
    .namespace {
      opacity: 0.7;
    }

    .token.boolean,
    .token.constant,
    .token.deleted,
    .token.number,
    .token.symbol {
      color: var(--color-prettylights-syntax-entity-tag);
    }

    .token.builtin,
    .token.char,
    .token.inserted,
    .token.selector,
    .token.string {
      color: var(--color-prettylights-syntax-constant);
    }

    .style .token.string,
    .token.entity,
    .token.property,
    .token.operator,
    .token.url {
      color: var(--color-prettylights-syntax-constant);
    }

    .token.atrule,
    .token.property-access .token.method,
    .token.keyword {
      color: var(--color-prettylights-syntax-keyword);
    }

    .token.function {
      color: var(--color-prettylights-syntax-string);
    }

    .token.important,
    .token.regex,
    .token.variable {
      color: var(--color-prettylights-syntax-string-regexp);
    }

    .token.bold,
    .token.important {
      color: var(--color-prettylights-syntax-markup-bold);
    }
    .token.tag {
      color: var(--color-prettylights-syntax-entity-tag);
    }
    .token.attr-value,
    .token.attr-name {
      color: var(--color-prettylights-syntax-constant);
    }
    .token.selector .class,
    .token.class-name {
      color: var(--color-prettylights-syntax-entity);
    }
  }
`
