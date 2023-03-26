import { IButton } from '../Buttons/Button'
import { ILink } from '../Buttons/Link'
import fuzzy from 'fuzzy'

const filterAllButtons = <T extends IButton>(list: T[], value: string): T[] => {
  const filteredLinks = list.filter(item => {
    if ((item as ILink).url) {
      const link = item as ILink

      if (!link.text) {
        const hasSameUrlWithText = list.some(jItem => {
          if ((jItem as ILink).url) {
            const jLink = jItem as ILink

            return Boolean(jLink.text) && link.url === jLink.url
          }

          return false
        })

        return !hasSameUrlWithText
      }
    }

    return true
  }).map(item => {
    item.text = (item.text || item.parentText)?.trim() || (item as ILink).url || ''

    return item
  })

  return fuzzy.filter(value, filteredLinks, {
    pre: '<b>',
    post: '</b>',
    extract(input: T): string {
      return input.text
    }
  }).map(item => {
    item.original.string = item.string

    return item.original
  })
}

export default filterAllButtons