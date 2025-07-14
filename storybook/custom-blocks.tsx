import * as DocBlocks from "@storybook/addon-docs/blocks"
import { DocsContainer } from "@storybook/addon-docs/blocks"

const container: typeof DocsContainer = ({ children, ...props }) => (
  <DocsContainer {...props}>{children}</DocsContainer>
)

const Page: typeof DocBlocks.DocsPage = () => (
  <>
    <DocBlocks.Title />
    <DocBlocks.Subtitle />
    <DocBlocks.Description />
    <DocBlocks.Stories />
    <DocBlocks.Controls />
  </>
)

export const customBlocks = {
  page: Page,
  container,
}
