import { it } from "vitest"

import { matchPath } from "./match-path"

describe("Test hash-router -> matchPath", () => {
  it.each`
    matcher        | path           | result
    ${""}          | ${""}          | ${{}}
    ${"route"}     | ${"route"}     | ${{}}
    ${"route"}     | ${"route/"}    | ${{}}
    ${"route/"}    | ${"route"}     | ${{}}
    ${"app/route"} | ${"app/route"} | ${{}}
    ${"app/route"} | ${"app"}       | ${null}
    ${"app"}       | ${"app/route"} | ${null}
  `(
    "Matches $matcher to $path and returns $result",
    ({ path, matcher, result }) => {
      expect(matchPath(matcher, path)).toStrictEqual(result)
    }
  )

  it.each`
    matcher                  | path              | result
    ${"app/:param"}          | ${"app/123"}      | ${{ param: "123" }}
    ${"app/:param/more"}     | ${"app/123/more"} | ${{ param: "123" }}
    ${"app/:param1/:param2"} | ${"app/123/456"}  | ${{ param1: "123", param2: "456" }}
    ${"app/:param"}          | ${"app/"}         | ${null}
    ${"app/:param1/:param2"} | ${"app/123"}      | ${null}
    ${"app/:param/more"}     | ${"app/123"}      | ${null}
    ${"app/:param"}          | ${"app/123/more"} | ${null}
  `(
    "Matches $matcher to $path and returns $result",
    ({ path, matcher, result }) => {
      expect(matchPath(matcher, path)).toStrictEqual(result)
    }
  )
})
