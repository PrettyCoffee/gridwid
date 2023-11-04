import { useState } from "react"

import { AlertTriangle, Bug, CheckCheck, Info, Star } from "lucide-react"

import { AlertBanner } from "~/components/AlertBanner"
import { HStack, VStack } from "~/components/base/Stack"
import { ColorPicker } from "~/components/ColorPicker"
import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { InputLabel } from "~/components/InputLabel"
import { ListItem } from "~/components/ListItem"
import { Section } from "~/components/Section"
import { StatusIndicator } from "~/components/StatusIndicator"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Dialog } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Tabs } from "~/components/ui/tabs"

import { settingsView } from "./Settings"

const titleCase = (text: string) =>
  text
    .split("-")
    .map(word => (word[0]?.toUpperCase() ?? "") + word.slice(1))
    .join(" ")

const tokens = {
  base: [
    "page",
    "background",
    "foreground",
    "muted",
    "muted-foreground",
    "hover",
    "press",
  ],
  button: ["button", "button-foreground", "button-hover", "button-press"],
  special: ["border", "input", "ring"],
  status: ["accent", "success", "warning", "error", "info"],
} as const

type ValueOf<T> = T[keyof T]
type Token = ValueOf<typeof tokens>[number]

const getColorValue = (color: Token) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${color}`)

const setColorValue = (color: Token, value: string) =>
  document.documentElement.style.setProperty(`--${color}`, value)

const getColors = () =>
  Object.fromEntries(
    Object.values(tokens)
      .flat()
      .map(token => [token, getColorValue(token)] as const)
  ) as Record<Token, string>

const ColorSchemeEditor = () => {
  const [colors, setColors] = useState(getColors())

  const setColor = (token: Token, value: string) => {
    setColorValue(token, value)
    setColors(colors => ({ ...colors, [token]: value }))
  }

  return (
    <VStack gap="4">
      {Object.entries(tokens).map(([group, tokens]) => (
        <Section key={group} title={titleCase(group)} className="">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4">
            {tokens.map(token => (
              <InputLabel key={token} label={titleCase(token)} htmlFor={token}>
                <ColorPicker
                  id={token}
                  value={colors[token]}
                  onChange={value => setColor(token, value)}
                />
              </InputLabel>
            ))}
          </div>
        </Section>
      ))}
    </VStack>
  )
}

const ComponentsPreview = () => {
  const [tab, setTab] = useState("1")
  return (
    <div className="[&>*]:float-left [&>*]:m-2 block">
      <IconButton icon={Star} title="Star" />
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="highlight">Highlight</Button>
      <Button variant="link">Link</Button>

      <ul>
        <ListItem.Root>
          <ListItem.Clickable>
            <Icon icon={CheckCheck} />
            <ListItem.Caption title="List item 1" />
          </ListItem.Clickable>
        </ListItem.Root>
        <ListItem.Root>
          <ListItem.Clickable>
            <Icon icon={CheckCheck} />
            <ListItem.Caption title="List item 2" />
          </ListItem.Clickable>
        </ListItem.Root>
        <ListItem.Root>
          <ListItem.Clickable>
            <Icon icon={CheckCheck} />
            <ListItem.Caption title="List item 3" />
          </ListItem.Clickable>
        </ListItem.Root>
      </ul>

      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List>
          <Tabs.Trigger value="1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="3">Tab 3</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <Input type="text" placeholder="Type here..." className="w-40" />
      <Checkbox />
      <Checkbox defaultChecked />

      <AlertBanner.Root className="w-40" variant="success">
        <Icon icon={CheckCheck} />
        <AlertBanner.Title>Success</AlertBanner.Title>
      </AlertBanner.Root>
      <AlertBanner.Root className="w-40" variant="warning">
        <Icon icon={AlertTriangle} />
        <AlertBanner.Title>Warning</AlertBanner.Title>
      </AlertBanner.Root>
      <AlertBanner.Root className="w-40" variant="error">
        <Icon icon={Bug} />
        <AlertBanner.Title>Error</AlertBanner.Title>
      </AlertBanner.Root>
      <AlertBanner.Root className="w-40" variant="info">
        <Icon icon={Info} />
        <AlertBanner.Title>Info</AlertBanner.Title>
      </AlertBanner.Root>

      <HStack wrap gap="2">
        <HStack items="center" justify="center" className="relative h-10 w-10">
          <Icon icon={CheckCheck} color="muted" />
          <StatusIndicator kind="success" />
        </HStack>

        <HStack items="center" justify="center" className="relative h-10 w-10">
          <Icon icon={AlertTriangle} color="muted" />
          <StatusIndicator kind="warning" />
        </HStack>
        <HStack items="center" justify="center" className="relative h-10 w-10">
          <Icon icon={Bug} color="muted" />
          <StatusIndicator kind="error" />
        </HStack>
        <HStack items="center" justify="center" className="relative h-10 w-10">
          <Icon icon={Info} color="muted" />
          <StatusIndicator kind="info" />
        </HStack>
      </HStack>
    </div>
  )
}

export const ThemeSettings = ({ open }: { open: boolean }) => (
  <Dialog
    open={open}
    onOpenChange={() => settingsView.set(null)}
    title="Theme Settings"
    description="Adapt gridwid to your style."
    size="fluid"
  >
    <HStack gap="8" justify="center">
      <div className="lg:min-w-[calc(theme(width.20)*7)] lg:max-w-xl w-full">
        <ColorSchemeEditor />
      </div>

      <Section title="Preview" className="sticky top-0 w-96 hidden lg:block">
        <ComponentsPreview />
      </Section>
    </HStack>
  </Dialog>
)
