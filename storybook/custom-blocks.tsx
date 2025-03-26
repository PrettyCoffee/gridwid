import * as DocBlocks from "@storybook/blocks"
import { DocsContainer } from "@storybook/blocks"

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

export const cusomtBlocks = {
  page: Page,
  container,
}
