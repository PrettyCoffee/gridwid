import { render as rtlRender, RenderOptions } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { Fragment, ReactNode } from "react"

import { AppProviders } from "app/providers"

/* eslint-disable import/export */
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
