import { PropsWithChildren, useEffect, useRef, useState } from "react"

import { Bell, Bird, Sticker, Flame, Banana, Ghost, Rocket } from "lucide-react"
import { atom, localStorage, useAtomValue } from "yaasl/react"

import localChangelog from "~/changelog.json"
import { AlertBanner } from "~/components/AlertBanner"
import { Grid } from "~/components/Grid"
import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { Section } from "~/components/Section"
import { StatusIndicator } from "~/components/StatusIndicator"
import { TaskBar } from "~/components/TaskBar"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Card } from "~/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { tomorrow } from "~/lib/datetime"
import { ImageWidget } from "~/widgets/image/ImageWidget"
import { LinkTreeWidget } from "~/widgets/link-tree/LinkTreeWidget"
import { RepoWidget } from "~/widgets/repo/RepoWidget"
import { TaskListWidget } from "~/widgets/task-list/TaskListWidget"

import { Menu } from "./Menu"
import { Workspaces } from "./Workspaces"

interface Change {
  version: string
  release: string
  changes: string[]
}

const validateChangelog = (value: unknown): value is Change[] =>
  Array.isArray(value) &&
  value.every(
    (entry: unknown) =>
      entry != null &&
      typeof entry === "object" &&
      "version" in entry &&
      typeof entry.version === "string"
  )

const parseVersion = (version: string) => {
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number)
  return { major, minor, patch }
}

const compareVersions = (a: string, b: string) => {
  const versionA = parseVersion(a)
  const versionB = parseVersion(b)
  return (
    versionA.major - versionB.major ||
    versionA.minor - versionB.minor ||
    versionA.patch - versionB.patch
  )
}

const sortChangelog = (changelog: Change[]) =>
  changelog.sort((a, b) => compareVersions(a.version, b.version)).reverse()

const rawbase = "https://raw.githubusercontent.com"
const repo = "/prettycoffee/gridwid/master"
const changelogPath = "/src/changelog.json"

const fetchChangelog = fetch(`${rawbase}${repo}${changelogPath}`)
  .then(response => response.json())
  .then(json => (!validateChangelog(json) ? [] : sortChangelog(json)))

const changelogAtom = atom<Change[] | null>({
  name: "changelog",
  defaultValue: null,
  middleware: [localStorage({ expiresAt: tomorrow })],
})

const getLocalVersion = () => sortChangelog(localChangelog)[0]?.version
const versionAtom = atom<string | null>({
  name: "version",
  defaultValue: getLocalVersion() ?? null,
  middleware: [localStorage()],
})

const NewVersionAlert = () => {
  const latestVersion = useAtomValue(versionAtom)
  const changelog = useAtomValue(changelogAtom)
  const currentVersion = changelog?.[0]?.version
  const didChange = !latestVersion || currentVersion !== latestVersion

  useEffect(() => {
    if (changelog) return
    changelogAtom.unwrap(fetchChangelog).catch(console.error)
  }, [changelog])

  return !didChange ? null : (
    <Card className="p-0">
      <AlertBanner.Root variant="info">
        <Icon icon={Rocket} />
        <AlertBanner.Title>New version available!</AlertBanner.Title>
        <AlertBanner.Description>
          A new gridwid version is available. See the changelog for a list of
          all new features.
        </AlertBanner.Description>
        <div className="flex justify-end gap-2 pt-2 text-foreground">
          <Button
            variant="ghost"
            onClick={() => currentVersion && versionAtom.set(currentVersion)}
          >
            Dismiss
          </Button>
          <Button variant="outline">Open</Button>
        </div>
      </AlertBanner.Root>
    </Card>
  )
}

const Clock = () => {
  const [date, setDate] = useState(new Date())
  const interval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const clear = () => clearInterval(interval.current)
    if (interval.current) {
      clear()
    }

    interval.current = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return clear
  }, [])

  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })
  const day = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div>
      <div className="text-xs text-end">{time}</div>
      <div className="text-muted-foreground text-xs text-end">{day}</div>
    </div>
  )
}

const Notifications = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" className="px-2 gap-2">
        <Clock />
        <Icon icon={Bell} size="sm" />
        <StatusIndicator kind="info" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      className="w-max flex flex-col gap-1 p-0 -translate-y-1 bg-transparent border-none overflow-auto max-h-[calc(100vh-theme(height.12)-theme(height.2))] max-w-[calc(theme(width.64)+theme(width.2))]"
    >
      <NewVersionAlert />
      <Card className="flex gap-2 justify-between p-2">
        <Button variant="outline">Some</Button>
        <Button variant="destructive">Content</Button>
      </Card>
      <Card className="p-2">
        <IconButton icon={Bird} title="Birb" />
        <IconButton icon={Banana} title="BANANA" />
        <IconButton icon={Sticker} title="Sticker" />
        <IconButton icon={Flame} title="Flame" />
        <IconButton icon={Ghost} title="*BOOOH*" />
      </Card>
      <Card className="p-2">
        <Calendar />
      </Card>
    </PopoverContent>
  </Popover>
)

const ScrollArea = ({ children }: PropsWithChildren) => (
  <div className="flex-1 overflow-auto p-2">{children}</div>
)

const RepoWidgets = () => (
  <Grid.Root>
    <Grid.Item columns={4} rows={4}>
      <RepoWidget owner="prettycoffee" name="yet-another-generic-startpage" />
    </Grid.Item>
    <Grid.Item columns={4} rows={4}>
      <RepoWidget owner="prettycoffee" name="gridwid" />
    </Grid.Item>
    <Grid.Item columns={3} rows={3}>
      <RepoWidget owner="shadcn" name="ui" />
    </Grid.Item>
    <Grid.Item columns={3} rows={2}>
      <ImageWidget
        id="3"
        src="https://i.pinimg.com/originals/fc/35/f2/fc35f21075cc1500fababbbbf501c2e1.gif"
      />
    </Grid.Item>
    <Grid.Item columns={3} rows={2}>
      <ImageWidget
        id="7"
        src="https://media.tenor.com/GjegbNUod5gAAAAC/duck-cute.gif"
      />
    </Grid.Item>
  </Grid.Root>
)

export const Page = () => (
  <div className="flex flex-col h-full">
    <ScrollArea>
      <Grid.Root>
        <Grid.Item columns={3} rows={4}>
          <LinkTreeWidget id="5" title="Bookmarks" />
        </Grid.Item>
        <Grid.Item columns={3} rows={4}>
          <TaskListWidget id="1" />
        </Grid.Item>
        <Grid.Item columns={5} rows={6}>
          <TaskListWidget id="2" title="Gridwid Tasks" />
        </Grid.Item>
        <Grid.Item columns={3} rows={2}>
          <ImageWidget
            id="4"
            src="https://i.pinimg.com/originals/10/e6/ef/10e6ef76794e3c11425387a2ee140f2c.gif"
          />
        </Grid.Item>
        <Grid.Item columns={3} rows={2}>
          <ImageWidget
            id="6"
            src="https://64.media.tumblr.com/54a945edd2641e20859d6f6537cd7423/tumblr_pwa4bogz4N1qze3hdo2_r1_500.gifv"
          />
        </Grid.Item>
      </Grid.Root>
      <Section title="Repositories" className="mt-4 [&>:first-of-type]:px-2">
        <RepoWidgets />
      </Section>
    </ScrollArea>
    <TaskBar.Root>
      <TaskBar.Section>
        <Workspaces />
      </TaskBar.Section>
      <TaskBar.Section>
        <Menu />
      </TaskBar.Section>
      <TaskBar.Section>
        <Notifications />
      </TaskBar.Section>
    </TaskBar.Root>
  </div>
)
