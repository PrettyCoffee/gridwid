import { useEffect, useMemo } from "react"

import { AvatarFallback } from "@radix-ui/react-avatar"
import {
  RefreshCw,
  GitFork,
  Eye,
  Star,
  BadgeAlert,
  MoreVertical,
  Bug,
  X,
} from "lucide-react"
import { useAtomValue } from "yaasl/react"

import { HStack } from "~/components/base/Stack"
import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { MenuButton } from "~/components/MenuButton"
import { NoData } from "~/components/NoData"
import { Section } from "~/components/Section"
import { Toast } from "~/components/Toast"
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
import { BaseWidgetProps } from "../widgetConfig"

const useGithubRepo = (owner: string, name: string) => {
  const { status, error, reload } = usePromise(() =>
    repoData.loadRepo(owner, name)
  )

  const repoName = repoData.getName(owner, name)
  const repos = useAtomValue(repoData.atom)
  const repo = useMemo(() => repos[repoName] ?? null, [repoName, repos])

  useEffect(() => {
    if (repo || status !== "resolved") {
      return
    }
    reload()
  }, [reload, repo, status])

  return { repo, status, error }
}

const RepoAvatarSkeleton = () => (
  <ListItem.Root className="flex gap-2 py-2 hover:bg-transparent">
    <AvatarSkeleton className="h-6 w-6" />
    <ListItem.CaptionSkeleton />
  </ListItem.Root>
)

const RepoWidgetSkeleton = () => (
  <Widget.Root>
    <Widget.Header>
      <Skeleton className="w-40 h-4" />
      <IconButton icon={MoreVertical} title="" />
    </Widget.Header>
    <Widget.Content scroll>
      <Section title="Info" stickyTitle>
        <RepoAvatarSkeleton />
        <div className="pb-0.5 pt-1">
          <Skeleton className="w-40 h-3" />
        </div>
        <div className="pb-0.5 pt-1">
          <Skeleton className="w-24 h-3" />
        </div>
        <Button variant="link">repo</Button>
      </Section>
      <Section title="Stats" stickyTitle>
        <div className="flex flex-wrap gap-1">
          {createRange(3).map(key => (
            <BadgeSkeleton key={key} />
          ))}
        </div>
      </Section>
      <Section title="Topics" stickyTitle>
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
      <Badge>{timeSince(pushed_at)}</Badge>
    </div>
  </>
)

const Topics = ({ topics }: GithubRepository) =>
  topics.length === 0 ? (
    <span className="text-muted-foreground text-sm ">No topics available</span>
  ) : (
    <HStack gap="1" wrap>
      {topics.map(topic => (
        <Badge key={topic}>{topic}</Badge>
      ))}
    </HStack>
  )

const Owner = ({ html_url, avatar_url, login }: GithubRepository["owner"]) => (
  <ListItem.Root className="-mx-2">
    <ListItem.Clickable href={html_url}>
      <Avatar className="h-6 w-6">
        <AvatarImage src={avatar_url} />
        <AvatarFallback>{login[0]}</AvatarFallback>
      </Avatar>
      <ListItem.Caption title={login} />
    </ListItem.Clickable>
  </ListItem.Root>
)

const Info = ({ owner, description, html_url, homepage }: GithubRepository) => (
  <>
    <Owner {...owner} />
    <div className="text-sm text-muted-foreground">
      {description || "No description"}
    </div>
    <HStack>
      <Button asChild variant="link" size="sm">
        <a href={html_url}>repo</a>
      </Button>
      {!!homepage && (
        <Button asChild variant="link" size="sm">
          <a href={homepage}>homepage</a>
        </Button>
      )}
    </HStack>
  </>
)

const WidgetSettings = ({ id, name, owner }: RepoWidgetProps) => {
  const settings = useRepoSettings(id)
  return (
    <MenuButton
      icon={MoreVertical}
      title="Repository widget settings"
      hideTitle
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

export interface RepoWidgetProps extends BaseWidgetProps {
  owner: string
  name: string
}
export const RepoWidget = ({ id, owner, name }: RepoWidgetProps) => {
  const { repo, status, error } = useGithubRepo(owner, name)
  const settings = useRepoSettings(id)

  if (status === "rejected") {
    const repoName = repoData.getName(owner, name)
    return (
      <Widget.Root>
        <Toast
          icon={Bug}
          kind="error"
          title={"Error in repo widget"}
          description={String(error?.message)}
          origin={repoName}
        />
        <NoData
          icon={X}
          message={`Data of "${repoName}" could not be fetched.`}
        />
      </Widget.Root>
    )
  }

  if (!repo || status === "pending") {
    return <RepoWidgetSkeleton />
  }

  return (
    <Widget.Root>
      <Widget.Header
        title={settings.hideOwnerInTitle ? repo.name : repo.full_name}
      >
        <WidgetSettings id={id} owner={owner} name={name} />
      </Widget.Header>
      <Widget.Content scroll>
        <Section title="Info" stickyTitle>
          <Info {...repo} />
        </Section>

        {settings.hideStats ? null : (
          <Section title="Stats" stickyTitle>
            <RepoStats {...repo} />
          </Section>
        )}

        {settings.hideTopics ? null : (
          <Section title="Topics" stickyTitle>
            <Topics {...repo} />
          </Section>
        )}
      </Widget.Content>
    </Widget.Root>
  )
}
