import { marked } from "marked"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Text } from "./Text"

interface MarkdownSheetProps extends ClassNameProp {
  children: string
}

export const MarkdownSheet = ({ children, className }: MarkdownSheetProps) =>
  children === "" ? (
    <div className={className}>
      <Text color="muted" block className="max-w-prose mx-auto w-max">
        - No content -
      </Text>
    </div>
  ) : (
    <Text asChild>
      <div
        className={cn(
          "break-words",

          "[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:mb-3",
          "[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-6",
          "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4",
          "[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-1 [&_h4]:mt-4",
          "[&_h5]:text-xl [&_h5]:mb-1 [&_h5]:mt-2",
          "[&_h6]:text-lg [&_h6]:mb-1 [&_h6]:mt-2",

          "[&_a]:font-normal [&_a]:text-highlight-foreground [&_a:hover]:underline",
          "[&>p]:my-2",

          "[&_ul]:ml-8 [&_ul>li]:list-disc [&_ul>li]:list-item",
          "[&_ol]:ml-8 [&_ol>li]:list-decimal [&_ol>li]:list-item",

          "[&_blockquote]:border-l-4 [&_blockquote]:pl-4",
          "[&_pre]:bg-accent [&_pre]:rounded-sm [&_pre]:px-4 [&_pre]:py-2 [&_pre]:text-sm",
          "[&_code]:font-mono [&_code]:text-sm [&_code]:bg-accent [&_code]:text-accent-foreground [&_code]:rounded-sm",

          "[&_table]:w-auto [&_table]:my-4",
          "[&_td]:px-2 [&_td]:py-1 [&_td]:border-b [&_td]:border-accent [&_tr:nth-of-type(even)]:bg-accent/50",
          "[&_th]:px-2 [&_th]:py-1 [&_th]:border-b [&_th]:border-accent",

          className
        )}
        dangerouslySetInnerHTML={{ __html: marked.parse(children) }}
      />
    </Text>
  )
