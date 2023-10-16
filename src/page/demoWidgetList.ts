import { WidgetConfigList } from "~/widgets/widgetConfig"

/* eslint-disable sonarjs/no-duplicate-string */
export const repoWidgets: WidgetConfigList = [
  {
    size: { columns: 4, rows: 4 },
    widget: "github-repo",
    props: {
      id: "repo-1",
      owner: "prettycoffee",
      name: "yet-another-generic-startpage",
    },
  },
  {
    widget: "github-repo",
    size: { columns: 4, rows: 4 },
    props: { id: "repo-2", owner: "prettycoffee", name: "gridwid" },
  },
  {
    widget: "github-repo",
    size: { columns: 3, rows: 3 },
    props: { id: "repo-3", owner: "shadcn", name: "ui" },
  },
  {
    widget: "image",
    size: { columns: 3, rows: 2 },
    props: {
      id: "image-1",
      src: "https://i.pinimg.com/originals/fc/35/f2/fc35f21075cc1500fababbbbf501c2e1.gif",
    },
  },
  {
    widget: "image",
    size: { columns: 3, rows: 2 },
    props: {
      id: "image-2",
      src: "https://media.tenor.com/GjegbNUod5gAAAAC/duck-cute.gif",
    },
  },
]

export const mainWidgets: WidgetConfigList = [
  {
    widget: "link-tree",
    size: { columns: 3, rows: 4 },
    props: { id: "link-tree-1", title: "Bookmarks" },
  },
  {
    widget: "task-list",
    size: { columns: 3, rows: 4 },
    props: { id: "1" },
  },
  {
    widget: "task-list",
    size: { columns: 5, rows: 6 },
    props: { id: "2", title: "Gridwid Tasks" },
  },
  {
    widget: "image",
    size: { columns: 3, rows: 2 },
    props: {
      id: "image-3",
      src: "https://i.pinimg.com/originals/10/e6/ef/10e6ef76794e3c11425387a2ee140f2c.gif",
    },
  },
  {
    widget: "image",
    size: { columns: 3, rows: 2 },
    props: {
      id: "image-4",
      src: "https://64.media.tumblr.com/54a945edd2641e20859d6f6537cd7423/tumblr_pwa4bogz4N1qze3hdo2_r1_500.gifv",
    },
  },
]
