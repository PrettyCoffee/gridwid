import { css } from "goober"

import { theme } from "../../tailwind/theme"

/* eslint-disable sonarjs/no-duplicate-string */
export const prismTheme = css`
  color: ${theme.get("color.neutral.200")};

  /** Allow to show line numbers */
  pre[class*="language-"] {
    overflow-x: hidden;

    .code-highlight {
      float: left;
      min-width: 100%;
    }

    .line-number::before {
      /* Line number color */
      color: ${theme.get("color.neutral.400")};
      /* Line number */
      content: attr(line);

      display: inline-block;
      width: calc(3ch + 0.5rem);
      text-align: right;
      padding-right: 0.5rem;
      margin-right: 0.5rem;
      border-right: 1px solid ${theme.get("color.neutral.700")};
      white-space: nowrap;
    }
  }

  code[class*="language-"],
  pre[class*="language-"] {
    /* See https://prismjs.com/tokens.html for all tokens */

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: ${theme.get("color.neutral.400")};
    }

    .token.punctuation {
      color: ${theme.get("color.neutral.500")};
    }

    .namespace {
      opacity: 0.7;
    }

    .token.keyword {
      color: ${theme.get("color.category.violet")};
    }

    .token.tag,
    .token.builtin,
    .token.constant {
      color: ${theme.get("color.category.red")};
    }
    .token.boolean {
      color: ${theme.get("color.category.violet")};
    }

    .token.class-name,
    .token.maybe-class-name {
      color: ${theme.get("color.category.orange")};
    }

    .token.number {
      color: ${theme.get("color.category.orange")};
    }

    .token.string,
    .token.char,
    .token.attr-value {
      color: ${theme.get("color.category.green")};
    }

    .token.symbol {
      color: ${theme.get("color.category.red")};
    }

    .token.attr-name {
      color: ${theme.get("color.category.orange")};
    }

    .token.variable {
      color: ${theme.get("color.category.red")};
    }

    .token.operator {
      color: ${theme.get("color.category.cyan")};
    }

    .token.entity {
      color: ${theme.get("color.category.red")};
    }

    .token.function {
      color: ${theme.get("color.category.blue")};
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
      background-color: ${theme.get("color.neutral.900")};
      box-shadow: inset 0.25rem 00 0 ${theme.get("color.accent")};
    }

    /** Git diff specific */

    .token.coord {
      /* diff meta info */
      color: ${theme.get("color.neutral.500")};
    }
    .token.inserted {
      color: ${theme.get("color.alert.success")};
    }
    .token.deleted {
      color: ${theme.get("color.alert.error")};
    }
    .code-line.inserted {
      /* inserted line (+) color */
      color: ${theme.get("color.alert.success")};
      background-color: hsla(
        from ${theme.get("color.alert.success")} h s l / 0.1
      );
    }
    .code-line.deleted {
      /* deleted line (-) color */
      color: ${theme.get("color.alert.error")};
      background-color: hsla(
        from ${theme.get("color.alert.error")} h s l / 0.1
      );
    }

    /** Regex specific */

    .token.regex {
      color: ${theme.get("color.category.red")};
      .token.quantifier.number {
        color: ${theme.get("color.category.cyan")};
      }
      .token.char-set.class-name {
        color: ${theme.get("color.category.violet")};
      }
      .token.regex-delimiter,
      .token.punctuation {
        color: ${theme.get("color.neutral.500")};
      }
      .token.regex-flags {
        color: ${theme.get("color.category.orange")};
      }
    }

    /** Css specific */

    .token.selector {
      color: ${theme.get("color.category.cyan")};
    }

    .token.property {
      color: ${theme.get("color.category.violet")};
    }

    .token.atrule {
      color: ${theme.get("color.category.red")};
    }

    /** Markdown specific */

    .token.table {
      display: initial;
    }

    .token.title {
      color: ${theme.get("color.neutral.100")};
      .token.punctuation {
        color: ${theme.get("color.neutral.500")};
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
      color: ${theme.get("color.neutral.500")};
      .token.content {
        color: ${theme.get("color.category.red")};
      }
      .token.url {
        color: ${theme.get("color.category.blue")};
      }
    }

    .language-markdown {
      .token.punctuation {
        color: ${theme.get("color.neutral.500")};
      }
      .token.list.punctuation {
        color: ${theme.get("color.category.blue")};
      }
    }
  }
`
