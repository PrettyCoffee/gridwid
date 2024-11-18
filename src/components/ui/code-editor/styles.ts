import { css } from "goober"

import { theme } from "../../../../tailwind/theme"

/* eslint-disable sonarjs/no-duplicate-string */
export const rehypeTheme = css`
  color: ${theme.get("color.neutral.200")};
  background-color: ${theme.get("color.neutral.900")};

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

    /** Git diff specific */

    .token.inserted {
      color: ${theme.get("color.alert.success")};
    }
    .token.deleted {
      color: ${theme.get("color.alert.error")};
    }
    .token.coord {
      color: ${theme.get("color.neutral.500")};
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
