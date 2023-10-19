import { useCallback, useEffect, useState } from "react"

import { Github } from "lucide-react"
import {
  atom,
  expiration,
  indexedDb,
  reduxDevtools,
  useAtomValue,
} from "yaasl/react"

import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { Section } from "~/components/Section"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarSkeleton,
} from "~/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { GithubUser, GithubRepository, github } from "~/lib/apis/github"
import { createRange } from "~/lib/createRange"
import { tomorrow } from "~/lib/datetime"
import { isProdEnv } from "~/lib/isDevEnv"
import { yaaslSetup } from "~/lib/yaaslSetup"

yaaslSetup()

export const githubProfile = atom<GithubUser | null>({
  defaultValue: null,
  name: "github-profile",
  middleware: [
    indexedDb(),
    expiration({ expiresAt: tomorrow }),
    reduxDevtools({ disable: isProdEnv }),
  ],
})

export const githubUserRepos = atom<GithubRepository[] | null>({
  defaultValue: null,
  name: "github-user-repos",
  middleware: [
    indexedDb(),
    expiration({ expiresAt: tomorrow }),
    reduxDevtools({ disable: isProdEnv }),
  ],
})

const useGithubProfile = () => {
  const user = useAtomValue(githubProfile)

  const load = useCallback((name: string) => {
    githubProfile.set(null)
    return githubProfile.unwrap(github.user(name))
  }, [])

  return { user, loadUser: load }
}

const sortReposByPush = (a: GithubRepository, b: GithubRepository) =>
  new Date(b.pushed_at).valueOf() - new Date(a.pushed_at).valueOf()

const isNoFork = ({ fork }: GithubRepository) => !fork

const useGithubUserRepos = () => {
  const repos = useAtomValue(githubUserRepos)

  const load = useCallback((name: string) => {
    const userRepositories = github
      .userRepositories(name)
      .then(repos => repos.filter(isNoFork).sort(sortReposByPush))

    githubUserRepos.set(null)
    return githubUserRepos.unwrap(userRepositories)
  }, [])

  return { repos, loadRepos: load }
}

const MAX_DISPLAYED_REPOS = 4
const RepoList = ({ repos }: { repos: GithubRepository[] | null }) => {
  if (repos == null) {
    return createRange(MAX_DISPLAYED_REPOS).map(i => (
      <ListItem.Root
        key={i}
        compact
        className="flex px-2 py-1 hover:bg-transparent"
      >
        <ListItem.CaptionSkeleton subtitle />
      </ListItem.Root>
    ))
  }

  return (
    <>
      {repos
        .slice(0, MAX_DISPLAYED_REPOS)
        .map(({ full_name, description, html_url }) => (
          <ListItem.Root key={full_name} compact>
            <ListItem.Clickable href={html_url}>
              <ListItem.Caption title={full_name} subtitle={description} />
            </ListItem.Clickable>
          </ListItem.Root>
        ))}
    </>
  )
}

const UserInfo = ({ user }: { user: GithubUser | null }) => {
  if (user == null) {
    return (
      <ListItem.Root className="flex gap-2 px-2 py-1 hover:bg-transparent">
        <AvatarSkeleton />
        <ListItem.CaptionSkeleton subtitle />
      </ListItem.Root>
    )
  }

  return (
    <ListItem.Root>
      <ListItem.Clickable href={user.html_url}>
        <Avatar>
          <AvatarImage src={user.avatar_url} alt="github profile avatar" />
          <AvatarFallback>
            <span className="text-xs">{user.name[0] ?? "NA"}</span>
          </AvatarFallback>
        </Avatar>
        <ListItem.Caption title={user.name} subtitle={user.bio} />
      </ListItem.Clickable>
    </ListItem.Root>
  )
}

const Profile = ({ name }: { name: string }) => {
  const { user, loadUser } = useGithubProfile()
  const { repos, loadRepos } = useGithubUserRepos()
  const [didFail, setDidFail] = useState(false)

  useEffect(() => {
    const nameChanged = name.toLowerCase() !== user?.name.toLowerCase()
    if ((user !== null && !nameChanged) || didFail) {
      return
    }

    Promise.all([loadUser(name), loadRepos(name)]).catch(() => setDidFail(true))
  }, [loadRepos, loadUser, name, repos, user, didFail])

  if (didFail) {
    return <>User info of &quot;{name}&quot; could not be fetched.</>
  }

  return (
    <div className="px-2">
      <Section title="Profile">
        <div className="-mx-2">
          <UserInfo user={user} />
        </div>
      </Section>
      <Section title="Recent activity">
        <div className="-mx-2 flex flex-col">
          <RepoList repos={repos} />
        </div>
      </Section>
    </div>
  )
}

interface GithubOverviewProps {
  name?: string
}

export const GithubOverview = ({ name }: GithubOverviewProps) =>
  !name ? null : (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon={Github} title="Github overview" />
      </PopoverTrigger>
      <PopoverContent className="mb-1">
        <Profile name={name} />
      </PopoverContent>
    </Popover>
  )
