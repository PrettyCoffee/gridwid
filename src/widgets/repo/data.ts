import { atom, localStorage } from "yaasl/react"

import { GithubRepository, github } from "~/lib/apis/github"
import { tomorrow } from "~/lib/datetime"
import { mapParser } from "~/lib/mapParser"
import { yaaslSetup } from "~/lib/yaaslSetup"

export type RepoList = Map<string, GithubRepository>

yaaslSetup()
const cachedRepos = atom<RepoList>({
  defaultValue: new Map(),
  name: "repo-widget",
  middleware: [localStorage({ expiresAt: tomorrow, parser: mapParser })],
})

const getName = (owner: string, name: string) => `${owner}/${name}`

const loadRepo = (owner: string, name: string) => {
  const repoName = getName(owner, name)
  const repos = cachedRepos.get()

  const existing = repos.get(repoName)
  if (existing) {
    return Promise.resolve(existing)
  }

  return github.repository(owner, name).then(repo => {
    cachedRepos.set(repos =>
      repos.get(repoName)
        ? repos
        : new Map([...repos.entries(), [repoName, repo]])
    )
    return repo
  })
}

const removeRepo = (owner: string, name: string) => {
  const repoName = getName(owner, name)
  const repos = cachedRepos.get()
  const existing = repos.get(repoName)
  if (!existing) return

  cachedRepos.set(repos => {
    const next = new Map(repos)
    next.delete(repoName)
    return next
  })
}

export const repoData = {
  atom: cachedRepos,
  loadRepo,
  removeRepo,
  getName,
}
