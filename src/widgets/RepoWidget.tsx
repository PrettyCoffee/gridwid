import { useCallback, useEffect, useMemo, useState } from "react"

import { AvatarFallback } from "@radix-ui/react-avatar"
import { RefreshCw, GitFork, Eye, Star, BadgeAlert } from "lucide-react"
import {
  LocalStorageParser,
  atom,
  localStorage,
  useAtomValue,
} from "yaasl/react"

import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { Section } from "~/components/Section"
import { Avatar, AvatarImage, AvatarSkeleton } from "~/components/ui/avatar"
import { Badge, BadgeSkeleton, IconBadge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { Widget } from "~/components/Widget"
import { GithubRepository, github } from "~/lib/apis/github"
import { createRange } from "~/lib/createRange"
import { timeSince, tomorrow } from "~/lib/datetime"
import { yaaslSetup } from "~/lib/yaaslSetup"

const isMapEntry = (value: unknown): value is [unknown, unknown] =>
  Array.isArray(value) && value.length === 2

const mapParser: LocalStorageParser<Map<unknown, unknown>> = {
  parse: text => {
    const value: unknown = JSON.parse(text)
    if (!Array.isArray(value) || !value.every(isMapEntry))
      throw new Error("LocalStorage value is not a valid Map object")

    return new Map(value)
  },
  stringify: value => JSON.stringify(Array.from(value.entries())),
}

type RepoList = Map<string, GithubRepository>

yaaslSetup()
const repoWidgetRepos = atom<RepoList>({
  defaultValue: new Map(),
  name: "repo-widget-repos",
  middleware: [localStorage({ expiresAt: tomorrow(), parser: mapParser })],
})

const getRepoName = (owner: string, name: string) => `${owner}/${name}`

const addRepo = (owner: string, name: string) => {
  const repoName = getRepoName(owner, name)
  const repos = repoWidgetRepos.get()

  const existing = repos.get(repoName)
  if (existing) {
    return Promise.resolve(existing)
  }

  return github.repository(owner, name).then(repo => {
    repoWidgetRepos.set(repos =>
      repos.get(repoName)
        ? repos
        : new Map([...repos.entries(), [repoName, repo]])
    )
    return repo
  })
}

const removeRepo = (owner: string, name: string) => {
  const repoName = getRepoName(owner, name)
  const repos = repoWidgetRepos.get()
  const existing = repos.get(repoName)
  if (!existing) return

  repoWidgetRepos.set(repos => {
    const next = new Map(repos)
    next.delete(repoName)
    return next
  })
}

const useGithubRepo = (owner: string, name: string) => {
  const repos = useAtomValue(repoWidgetRepos)
  const repo = useMemo(
    () => repos.get(getRepoName(owner, name)) ?? null,
    [name, owner, repos]
  )

  const load = useCallback(() => addRepo(owner, name), [name, owner])

  return { repo, loadRepo: load }
}

const RepoWidgetSkeleton = () => (
  <Widget.Root>
    <Widget.Header>
      <Skeleton className="w-40 h-4" />
      <IconButton
        icon={RefreshCw}
        title="Refresh repository widget"
        clickAnimation="animate-spin-once"
      />
    </Widget.Header>
    <Widget.Content>
      <Section title="Info">
        <ListItem.Root className="-mx-2">
          <AvatarSkeleton className="h-6 w-6" />
          <ListItem.CaptionSkeleton />
        </ListItem.Root>
        <div className="pb-0.5 pt-1">
          <Skeleton className="w-40 h-3" />
        </div>
        <div className="pb-0.5 pt-1">
          <Skeleton className="w-24 h-3" />
        </div>
        <Button variant="link">repo</Button>
      </Section>
      <Section title="Stats">
        <div className="flex flex-wrap gap-1">
          {createRange(3).map(key => (
            <BadgeSkeleton key={key} />
          ))}
        </div>
      </Section>
      <Section title="Topics">
        <div className="flex flex-wrap gap-1">
          {createRange(3).map(key => (
            <BadgeSkeleton key={key} />
          ))}
        </div>
      </Section>
    </Widget.Content>
  </Widget.Root>
)

const RepoStats = ({
  watchers_count,
  forks_count,
  stargazers_count,
  open_issues_count,
  pushed_at,
}: GithubRepository) => (
  <div className="flex flex-wrap gap-1">
    <IconBadge icon={Eye} title="Watchers">
      {watchers_count}
    </IconBadge>
    <IconBadge icon={GitFork} title="Forks">
      {forks_count}
    </IconBadge>
    <IconBadge icon={Star} title="Stars">
      {stargazers_count}
    </IconBadge>
    <IconBadge icon={BadgeAlert} title="Open issues">
      {open_issues_count}
    </IconBadge>
    <Badge variant="secondary">Last push: {timeSince(pushed_at)}</Badge>
  </div>
)

const Topics = ({ topics }: GithubRepository) =>
  topics.length === 0 ? (
    <span className="text-muted-foreground text-sm ">No topics available</span>
  ) : (
    <div className="flex flex-wrap gap-1">
      {topics.map(topic => (
        <Badge key={topic} variant="secondary">
          {topic}
        </Badge>
      ))}
    </div>
  )

const Owner = ({ html_url, avatar_url, login }: GithubRepository["owner"]) => (
  <ListItem.Root href={html_url} className="-mx-2">
    <Avatar className="h-6 w-6">
      <AvatarImage src={avatar_url} />
      <AvatarFallback>{login[0]}</AvatarFallback>
    </Avatar>
    <ListItem.Caption title={login} />
  </ListItem.Root>
)

const Info = ({ owner, description, html_url, homepage }: GithubRepository) => (
  <>
    <Owner {...owner} />
    <div className="text-sm text-muted-foreground">
      {description || "No description"}
    </div>
    <div className="flex items-center">
      <Button asChild variant="link" size="sm">
        <a href={html_url}>repo</a>
      </Button>
      {!!homepage && (
        <Button asChild variant="link" size="sm">
          <a href={homepage}>homepage</a>
        </Button>
      )}
    </div>
  </>
)

interface RepoWidgetProps {
  owner: string
  name: string
}
export const RepoWidget = ({ owner, name }: RepoWidgetProps) => {
  const { repo, loadRepo } = useGithubRepo(owner, name)
  const [didFail, setDidFail] = useState(false)

  const repoName = getRepoName(owner, name)
  useEffect(() => {
    if (repo || didFail) {
      return
    }

    loadRepo().catch(() => setDidFail(true))
  }, [didFail, loadRepo, repo])

  if (didFail) {
    return <>Repo info of &quot;{repoName}&quot; could not be fetched.</>
  }

  if (!repo) {
    return <RepoWidgetSkeleton />
  }

  return (
    <Widget.Root>
      <Widget.Header title={repo.full_name}>
        <IconButton
          icon={RefreshCw}
          title="Refresh repository widget"
          clickAnimation="animate-spin-once"
          onClick={() => removeRepo(owner, name)}
        />
      </Widget.Header>
      <Widget.Content>
        <Section title="Info">
          <Info {...repo} />
        </Section>

        <Section title="Stats">
          <RepoStats {...repo} />
        </Section>

        <Section title="Topics">
          <Topics {...repo} />
        </Section>
      </Widget.Content>
    </Widget.Root>
  )
}