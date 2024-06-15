export function linkify(inputText) {
  const urlPattern = /(\bhttps?:\/\/[^\s]+[\w/])/g
  return inputText.replace(urlPattern, (url) => {
    return `<a class='msg-content--link' href=${url} target='_blank'>${url}</a>`
  })
}

export function removeHTMLTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}
