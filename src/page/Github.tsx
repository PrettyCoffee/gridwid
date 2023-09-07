import { useCallback, useEffect, useState } from "react"

import { Github } from "lucide-react"
import { atom, localStorage } from "yaasl"
import { useAtomValue } from "yaasl/react"

import { IconButton } from "~/components/IconButton"
import { Section } from "~/components/Section"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { buttonVariants } from "~/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Skeleton } from "~/components/ui/skeleton"
import { GithubUser, GithubRepository, github } from "~/lib/apis/github"
import { noOverflow } from "~/lib/styles"
import { cn } from "~/lib/utils"
import { yaaslSetup } from "~/lib/yaaslSetup"

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  return date
}

yaaslSetup()

const githubProfile = atom<GithubUser | null>({
  defaultValue: null,
  name: "github-profile",
  middleware: [localStorage({ expiresAt: tomorrow() })],
})

const githubUserRepos = atom<GithubRepository[] | null>({
  defaultValue: null,
  name: "github-user-repos",
  middleware: [localStorage({ expiresAt: tomorrow() })],
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

const EntrySkeleton = () => (
  <div className="flex flex-col gap-2 px-2 h-12 items-start justify-center">
    <Skeleton className="w-24 h-4" />
    <Skeleton className="w-40 h-3" />
  </div>
)

interface EntryProps {
  title: string
  subtitle: string
  href: string
}
const Entry = ({ title, subtitle, href }: EntryProps) => (
  <a
    href={href}
    className={cn(
      buttonVariants({ variant: "ghost" }),
      "flex-col py-0 px-2 h-12 items-start rounded hover:bg-accent"
    )}
  >
    <span className={cn(noOverflow, "text-sm")}>{title}</span>
    <span className={cn(noOverflow, "text-muted-foreground text-xs")}>
      {subtitle}
    </span>
  </a>
)

const RepoList = ({ repos }: { repos: GithubRepository[] | null }) => {
  if (!repos)
    return (
      <>
        <EntrySkeleton />
        <EntrySkeleton />
        <EntrySkeleton />
        <EntrySkeleton />
      </>
    )

  return (
    <>
      {repos.slice(0, 4).map(({ full_name, description, html_url }) => (
        <Entry
          key={full_name}
          title={full_name}
          subtitle={description}
          href={html_url}
        />
      ))}
    </>
  )
}

const UserInfo = ({ user }: { user: GithubUser | null }) => {
  if (user == null) {
    return (
      <div className="flex gap-4 p-2">
        <Skeleton className="rounded-full h-12 w-12" />
        <div className="flex flex-col justify-center gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-40 h-3" />
        </div>
      </div>
    )
  }

  return (
    <a
      href={user.html_url}
      className="flex items-center gap-3 px-2 py-1 hover:bg-accent rounded"
    >
      <Avatar>
        <AvatarImage src={user.avatar_url} alt="github profile avatar" />
        <AvatarFallback>
          <span className="text-xs">{user.name[0] ?? "NA"}</span>
        </AvatarFallback>
      </Avatar>
      <div className={cn(noOverflow, "flex flex-col justify-center")}>
        <div className={noOverflow}>{user.name}</div>
        <div className={cn(noOverflow, "text-muted-foreground text-sm")}>
          {user.bio}
        </div>
      </div>
    </a>
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
