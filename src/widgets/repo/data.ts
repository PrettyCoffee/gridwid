import { GithubRepository, github } from "~/lib/apis/github"
import { tomorrow } from "~/lib/datetime"

import { createDataAtom } from "../createDataAtom"

export type RepoList = Record<string, GithubRepository>

const repoCache = createDataAtom<GithubRepository | undefined>(
  "repo-widget",
  undefined,
  { expiresAt: tomorrow }
)

const getName = (owner: string, name: string) => `${owner}/${name}`

const loadRepo = (owner: string, name: string) => {
  const repoName = getName(owner, name)
  const existing = repoCache.getData(repoName)

  if (existing) {
    return Promise.resolve(existing)
  }

  return github.repository(owner, name).then(repo => {
    repoCache.setData(repoName, repo)
    return repo
  })
}

const removeRepo = (owner: string, name: string) => {
  const repoName = getName(owner, name)
  const existing = repoCache.getData(repoName)
  if (!existing) return

  repoCache.setData(repoName, undefined)
}

export const repoData = {
  atom: repoCache.atom,
  loadRepo,
  removeRepo,
  getName,
}
