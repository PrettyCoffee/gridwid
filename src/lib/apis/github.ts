export interface GithubUser {
  avatar_url: string
  html_url: string
  starred_url: string
  repos_url: string
  name: string

  blog?: string
  bio?: string
}

export interface GithubRepository {
  name: string
  full_name: string
  description: string
  // owner: GithubUser
  fork: boolean
  html_url: string
  topics: string[]
  updated_at: string
  pushed_at: string
  homepage: string
}

const handleResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(
      `An api error occured: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const githubRequest = <ExpectedType>(path: string) =>
  fetch(`https://api.github.com${path}`, {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  })
    .then(handleResponse)
    .then(result => result as ExpectedType)

/**
 * @see https://docs.github.com/en/rest/users/users#get-a-user
 */
const user = (name: string) => githubRequest<GithubUser>(`/users/${name}`)

/**
 * @see https://docs.github.com/en/rest/repos/repos#get-a-repository
 */
const repository = (owner: string, repo: string) =>
  githubRequest<GithubRepository>(`/repos/${owner}/${repo}`)

/**
 * @see https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
 */
const userRepositories = (name: string) =>
  githubRequest<GithubRepository[]>(`/users/${name}/repos`)

export const github = {
  user,
  repository,
  userRepositories,
}
