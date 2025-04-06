const createBlobUrl = (content: unknown) => {
  const fileContent = JSON.stringify(content, null, 2)
  const file = new Blob([fileContent])
  return URL.createObjectURL(file)
}

export const download = (fileName: string, content: unknown) => {
  const blobUrl = createBlobUrl(content)
  const link = document.createElement("a")

  link.href = blobUrl
  link.download = fileName

  document.body.appendChild(link)

  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )

  document.body.removeChild(link)
}
