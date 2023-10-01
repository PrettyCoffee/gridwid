import { useEffect } from "react"

import { Rocket } from "lucide-react"
import { atom, localStorage, reduxDevtools, useAtomValue } from "yaasl/react"

import localChangelog from "~/changelog.json"
import { Toast } from "~/components/Toast"
import { tomorrow } from "~/lib/datetime"

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

const VersionToast = () => {
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
          onClick: () => null,
        },
      ]}
    />
  )
}

export const Changelog = () => {
  return <VersionToast />
}
