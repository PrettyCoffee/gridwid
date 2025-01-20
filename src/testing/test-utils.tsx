import { Fragment, ReactNode } from "react"

import { render as rtlRender, RenderOptions } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

import { AppProviders } from "app/providers"

export * from "@testing-library/react"

export const render = (ui: ReactNode, options: RenderOptions = {}) => {
  const user = userEvent.setup()
  const Wrapper = options.wrapper ?? Fragment
  const result = rtlRender(ui, {
    ...options,
    wrapper: ({ children }) => (
      <AppProviders>
        <Wrapper>{children}</Wrapper>
      </AppProviders>
    ),
  })

  return { ...result, user }
}
