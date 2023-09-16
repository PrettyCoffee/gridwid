import { useEffect, useMemo } from "react"

import { AvatarFallback } from "@radix-ui/react-avatar"
import {
  RefreshCw,
  GitFork,
  Eye,
  Star,
  BadgeAlert,
  MoreVertical,
} from "lucide-react"
import { useAtomValue } from "yaasl/react"

import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { MenuButton } from "~/components/MenuButton"
import { Section } from "~/components/Section"
import { Avatar, AvatarImage, AvatarSkeleton } from "~/components/ui/avatar"
import { Badge, BadgeSkeleton, IconBadge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { Widget } from "~/components/Widget"
import { GithubRepository } from "~/lib/apis/github"
import { createRange } from "~/lib/createRange"
import { timeSince } from "~/lib/datetime"
import { usePromise } from "~/lib/usePromise"

import { repoData } from "./data"
import { getMenuSettings, useRepoSettings } from "./settings"

const useGithubRepo = (owner: string, name: string) => {
  const { status, error, reload } = usePromise(() =>
    repoData.loadRepo(owner, name)
  )

  const repoName = repoData.getName(owner, name)
  const repos = useAtomValue(repoData.atom)
  const repo = useMemo(() => repos[repoName] ?? null, [repoName, repos])

  useEffect(() => {
    if (status === "initial" || repo) {
      return
    }
    reload()
  }, [reload, repo, status])

  return { repo, status, error }
}

const RepoWidgetSkeleton = () => (
  <Widget.Root>
    <Widget.Header>
      <Skeleton className="w-40 h-4" />
      <IconButton
        icon={MoreVertical}
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
  <>
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
    </div>
    <div className="my-1 flex gap-2 items-center">
      <span className="text-sm text-muted-foreground">Last push:</span>
      <Badge variant="secondary">{timeSince(pushed_at)}</Badge>
    </div>
  </>
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

const WidgetSettings = ({ name, owner }: RepoWidgetProps) => {
  const id = repoData.getName(owner, name)
  const settings = useRepoSettings(id)
  return (
    <MenuButton
      icon={MoreVertical}
      title="Widget settings"
      titleSide="left"
      items={[
        {
          label: "Actions",
          items: [
            {
              label: "Refresh",
              icon: RefreshCw,
              onClick: () => repoData.removeRepo(owner, name),
            },
          ],
        },
        ...getMenuSettings(id, settings),
      ]}
    />
  )
}

interface RepoWidgetProps {
  owner: string
  name: string
}
export const RepoWidget = ({ owner, name }: RepoWidgetProps) => {
  const { repo, status } = useGithubRepo(owner, name)
  const repoName = repoData.getName(owner, name)
  const settings = useRepoSettings(repoName)

  if (status === "rejected") {
    return <>Repo info of &quot;{repoName}&quot; could not be fetched.</>
  }

  if (!repo || status === "pending") {
    return <RepoWidgetSkeleton />
  }

  return (
    <Widget.Root>
      <Widget.Header
        title={settings.hideOwnerInTitle ? repo.name : repo.full_name}
      >
        <WidgetSettings owner={owner} name={name} />
      </Widget.Header>
      <Widget.Content>
        <Section title="Info">
          <Info {...repo} />
        </Section>

        {settings.hideStats ? null : (
          <Section title="Stats">
            <RepoStats {...repo} />
          </Section>
        )}

        {settings.hideTopics ? null : (
          <Section title="Topics">
            <Topics {...repo} />
          </Section>
        )}
      </Widget.Content>
    </Widget.Root>
  )
}
