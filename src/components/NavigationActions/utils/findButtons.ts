import { IButton } from '../Buttons/Button'
import $ from 'jquery'
import getButtonText from './getButtonText'

const findButtons = (): IButton[] => {
  const buttons: IButton[] = []

  $('button, div[role="button"]').each(function() {
    const $button = $(this)
    const { text, parentText } = getButtonText($button)

    if (!$button.parents('#quick-command').length) {
      buttons.push({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        element: $button[0]!,
        text,
        parentText,
      })
    }
  })

  return buttons
}

export default findButtons