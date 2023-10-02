import { Dispatch, useEffect, useMemo, useState } from "react"

import { Rocket } from "lucide-react"
import { atom, localStorage, reduxDevtools, useAtomValue } from "yaasl/react"

import localChangelog from "~/changelog.json"
import { Text } from "~/components/Text"
import { Toast } from "~/components/Toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { tomorrow } from "~/lib/datetime"

interface Change {
  version: string
  release: string
  description?: string
  features?: string[]
  fixes?: string[]
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
  middleware: [
    localStorage({ expiresAt: tomorrow }),
    reduxDevtools({ disable: !import.meta.env.DEV }),
  ],
})

const getLocalVersion = () => sortChangelog(localChangelog)[0]?.version
const versionAtom = atom<string | null>({
  name: "version",
  defaultValue: getLocalVersion() ?? null,
  middleware: [
    localStorage(),
    reduxDevtools({ disable: !import.meta.env.DEV }),
  ],
})

const VersionToast = ({
  onOpenChange,
}: {
  onOpenChange: Dispatch<boolean>
}) => {
  const latestVersion = useAtomValue(versionAtom)
  const changelog = useAtomValue(changelogAtom)
  const currentVersion = changelog?.[0]?.version
  const didChange = !latestVersion || currentVersion !== latestVersion

  useEffect(() => {
    if (changelog) return
    changelogAtom.unwrap(fetchChangelog).catch(console.error)
  }, [changelog])

  return !didChange ? null : (
    <Toast
      kind="info"
      icon={Rocket}
      title="New version available!"
      description="A new gridwid version is available. See the changelog for a list of all new features."
      actions={[
        {
          label: "Dismiss",
          variant: "ghost",
          onClick: () => currentVersion && versionAtom.set(currentVersion),
        },
        {
          label: "Open",
          variant: "outline",
          onClick: () => onOpenChange(true),
        },
      ]}
    />
  )
}

const ChangeSection = ({
  list,
  text,
  title,
}: {
  title: string
  text?: string
  list?: string[]
}) => (
  <div className="py-2 pl-4">
    <Text asChild size="md" color="muted" weight="semibold">
      <h4>{title}</h4>
    </Text>
    {text && (
      <Text className="pl-4" asChild>
        <p>{text}</p>
      </Text>
    )}
    {list && (
      <ul className="list-disc pl-8">
        {list.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )}
  </div>
)

const ChangeList = ({
  version,
  release,
  description,
  features,
  fixes,
}: Change) => (
  <div className="pt-4">
    <Text style="large" size="xl" className="border-b" asChild>
      <h3>
        v{version}{" "}
        <Text style="small" color="muted">
          ({release})
        </Text>
      </h3>
    </Text>
    {description && <ChangeSection title="Description:" text={description} />}
    {features && <ChangeSection title="Features:" list={features} />}
    {fixes && <ChangeSection title="Bug Fixes:" list={fixes} />}
  </div>
)

export const Changelog = () => {
  const [open, setOpen] = useState(false)
  const repoChangelog = useAtomValue(changelogAtom)

  const changelog = useMemo(() => {
    const newChanges =
      repoChangelog?.filter(
        ({ version }) =>
          !localChangelog.some(change => version === change.version)
      ) ?? []

    return sortChangelog([...localChangelog, ...newChanges])
  }, [repoChangelog])

  return (
    <>
      <VersionToast onOpenChange={setOpen} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="lg" className="h-full">
          <DialogHeader>
            <DialogTitle>Changelog</DialogTitle>
          </DialogHeader>
          {changelog.map(change => (
            <ChangeList key={change.version} {...change} />
          ))}
        </DialogContent>
      </Dialog>
    </>
  )
}
