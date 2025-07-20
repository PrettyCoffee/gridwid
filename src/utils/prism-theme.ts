import { css } from "goober"

import { theme } from "../../tailwind/theme"

export const prismTheme = css`
  color: ${theme.read("color.text.default")};

  /** Allow to show line numbers */
  pre[class*="language-"] {
    color: ${theme.read("color.text.default")};
    word-break: break-word;

    /** Fix padding when a line wraps */
    .code-line.line-number {
      position: relative;
      /* 3 line number chars + 1rem padding right + 0.5rem padding left */
      padding-left: calc(3ch + 1.5rem) !important;
    }

    .code-highlight {
      float: left;
      min-width: 100%;
    }

    .code-line.line-number::before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;

      /* Line number color */
      color: ${theme.read("color.text.gentle")};
      /* Line number */
      content: attr(line);

      display: inline-block;
      width: calc(3ch + 1rem);
      text-align: right;
      padding-right: 0.5rem;
      border-right: 1px solid ${theme.read("color.stroke.gentle")};
      white-space: nowrap;
    }
  }

  code[class*="language-"] {
    /* See https://prismjs.com/tokens.html for all tokens */

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: ${theme.read("color.text.gentle")};
    }

    .token.punctuation {
      color: ${theme.read("color.text.muted")};
    }

    .namespace {
      opacity: 0.7;
    }

    .token.keyword {
      color: ${theme.read("color.category.violet")};
    }

    .token.tag,
    .token.builtin,
    .token.constant {
      color: ${theme.read("color.category.pink")};
    }
    .token.boolean {
      color: ${theme.read("color.category.violet")};
    }

    .token.class-name,
    .token.maybe-class-name {
      color: ${theme.read("color.category.orange")};
    }

    .token.number {
      color: ${theme.read("color.category.orange")};
    }

    .token.string,
    .token.char,
    .token.attr-value {
      color: ${theme.read("color.category.lime")};
    }

    .token.symbol {
      color: ${theme.read("color.category.pink")};
    }

    .token.attr-name {
      color: ${theme.read("color.category.orange")};
    }

    .token.variable {
      color: ${theme.read("color.category.pink")};
    }

    .token.operator {
      color: ${theme.read("color.category.cyan")};
    }

    .token.entity {
      color: ${theme.read("color.category.pink")};
    }

    .token.function {
      color: ${theme.read("color.category.blue")};
    }

    /** Highlighted lines (rehype-prism-plus specific) */

    .code-line {
      display: block;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-left: -1rem;
      margin-right: -1rem;
    }

    .highlight-line {
      background-color: hsla(from ${theme.read("color.accent")} h s l / 5%);
      box-shadow: inset 0.25rem 00 0 ${theme.read("color.accent")};
    }

    /** Git diff specific */

    .token.coord {
      /* diff meta info */
      color: ${theme.read("color.text.muted")};
    }
    .token.inserted {
      color: ${theme.read("color.alert.success")};
    }
    .token.deleted {
      color: ${theme.read("color.alert.error")};
    }
    .code-line.inserted {
      /* inserted line (+) color */
      color: ${theme.read("color.alert.success")};
      background-color: hsla(
        from ${theme.read("color.alert.success")} h s l / 0.1
      );
    }
    .code-line.deleted {
      /* deleted line (-) color */
      color: ${theme.read("color.alert.error")};
      background-color: hsla(
        from ${theme.read("color.alert.error")} h s l / 0.1
      );
    }

    /** Regex specific */

    .token.regex {
      color: ${theme.read("color.category.pink")};
      .token.quantifier.number {
        color: ${theme.read("color.category.cyan")};
      }
      .token.char-set.class-name {
        color: ${theme.read("color.category.violet")};
      }
      .token.regex-delimiter,
      .token.punctuation {
        color: ${theme.read("color.text.muted")};
      }
      .token.regex-flags {
        color: ${theme.read("color.category.orange")};
      }
    }

    /** Css specific */

    .token.selector {
      color: ${theme.read("color.category.cyan")};
    }

    .token.property {
      color: ${theme.read("color.category.violet")};
    }

    .token.atrule {
      color: ${theme.read("color.category.pink")};
    }

    /** Markdown specific */

    .token.table {
      display: initial;
    }

    .token.title {
      color: ${theme.read("color.text.priority")};
      .token.punctuation {
        color: ${theme.read("color.text.muted")};
      }
    }

    .token.important,
    .token.bold {
      font-weight: 500;
    }

    .token.italic {
      font-style: italic;
    }

    .token.url {
      color: ${theme.read("color.text.muted")};
      .token.content {
        color: ${theme.read("color.category.pink")};
      }
      .token.url {
        color: ${theme.read("color.category.blue")};
      }
    }

    .language-markdown {
      .token.punctuation {
        color: ${theme.read("color.text.muted")};
      }
      .token.list.punctuation {
        color: ${theme.read("color.category.blue")};
      }
    }
  }
`
