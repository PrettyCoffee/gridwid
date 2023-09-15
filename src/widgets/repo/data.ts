import { atom, localStorage } from "yaasl/react"

import { GithubRepository, github } from "~/lib/apis/github"
import { tomorrow } from "~/lib/datetime"
import { removeKeyFromObject } from "~/lib/removeKeyFromObject"
import { yaaslSetup } from "~/lib/yaaslSetup"

export type RepoList = Record<string, GithubRepository>

yaaslSetup()
const cachedRepos = atom<RepoList>({
  defaultValue: {},
  name: "repo-widget",
  middleware: [localStorage({ expiresAt: tomorrow })],
})

const getName = (owner: string, name: string) => `${owner}/${name}`

const loadRepo = (owner: string, name: string) => {
  const repoName = getName(owner, name)
  const repos = cachedRepos.get()

  const existing = repos[repoName]
  if (existing) {
    return Promise.resolve(existing)
  }

  return github.repository(owner, name).then(repo => {
    cachedRepos.set(repos => ({ ...repos, [repoName]: repo }))
    return repo
  })
}

const removeRepo = (owner: string, name: string) => {
  const repoName = getName(owner, name)
  const repos = cachedRepos.get()
  const existing = repos[repoName]
  if (!existing) return

  cachedRepos.set(repos => {
    const next = { ...repos }
    return removeKeyFromObject(next, repoName)
  })
}

export const repoData = {
  atom: cachedRepos,
  loadRepo,
  removeRepo,
  getName,
}
