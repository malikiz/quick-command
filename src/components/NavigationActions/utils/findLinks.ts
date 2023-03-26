import { ILink } from '../Buttons/Link'
import $ from 'jquery'
import getButtonText from './getButtonText'

const findLinks = (): ILink[] => {
  const links: ILink[] = []

  $('a').each(function() {
    const $link = $(this)
    const { text, parentText } = getButtonText($link)
    const href = $link.attr('href')

    if (href && !$link.parents('#quick-command').length) {
      links.push({
        element: $link[0],
        url: href,
        text,
        parentText,
      })
    }
  })

  return links
}

export default findLinks