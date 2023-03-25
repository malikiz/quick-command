import React, { useEffect, useState } from 'react'
import styles from './QuickCommand.module.scss'
import Input from './Input/Input'
import { ILink } from './Buttons/Link'
import $ from 'jquery'
import fuzzy from 'fuzzy'
import { IButton } from './Buttons/Button'
import Buttons from './Buttons/Buttons'

let oldFocusedButton: ILink | IButton

const sliceText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const getText = ($element: JQuery): {
  text: string
  parentText: string
} => {
  const maxLength = 100
  const text = $element.text() || $element.attr('title') || $element.attr('aria-label')
  const parentText = $element.siblings().text() || $element.parent().text() || $element.parent().parent().text()

  return {
    text: sliceText(text ?? '', maxLength),
    parentText: sliceText(parentText ?? '', maxLength),
  }
}

const findLinks = (): ILink[] => {
  const links: ILink[] = []

  $('a').each(function() {
    const $link = $(this)
    const { text, parentText } = getText($link)
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

const findButtons = (): IButton[] => {
  const buttons: IButton[] = []

  $('button, div[role="button"]').each(function() {
    const $button = $(this)
    const { text, parentText } = getText($button)

    if (!$button.parents('#quick-command').length) {
      buttons.push({
        element: $button[0],
        text,
        parentText,
      })
    }
  })

  return buttons
}

const filterAllButtons = <T extends ILink | IButton>(list: T[], value: string): T[] => {
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
    return {
      ...item,
      text: (item.text || item.parentText)?.trim() || (item as ILink).url || '',
    }
  })

  return fuzzy.filter(value, filteredLinks, {
    pre: '<b>',
    post: '</b>',
    extract(input: T): string {
      return input.text
    }
  }).map(item => {
    return {
      string: item.string,
      ...item.original
    }
  })
}

const QuickCommand = () => {
  const [isVisible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [allButtons, setAllButtons] = useState<IButton[]>([])
  const [allLinks, setAllLinks] = useState<ILink[]>([])
  const [focusedButtonIndex, setFocusedButtonIndex] = useState<number | null>(null)
  const [observerTick, setObserverTick] = useState(0)
  const filteredLinks = filterAllButtons(allLinks, inputValue)
  const filteredButtons = filterAllButtons(allButtons, inputValue)
  const commonFilteredButtons = [...filteredLinks, ...filteredButtons]

  const handleSetFocusedLinkIndex = (incrementValue: number) => {
    const value = (focusedButtonIndex ?? -1) + incrementValue

    if (value < 0) {
      setFocusedButtonIndex(null)
    } else {
      const newValue = Math.max(0, Math.min(value, commonFilteredButtons.length - 1))
      setFocusedButtonIndex(newValue)
    }
  }

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const isMutable = !mutations.some(mutation => {
        if (mutation.target) {
          return $(mutation.target).attr('id') === 'root-quick-command' || $(mutation.target).parents('#root-quick-command').length > 0
        }

        return false
      })

      if (isMutable) {
        setObserverTick(observerTick + 1)
      }
    })

    observer.observe(document.body, { childList:true, subtree:true })
  })

  useEffect(() => {
    setAllLinks(findLinks())
    setAllButtons(findButtons())
  }, [observerTick])

  useEffect(() => {
    let isCtrlPressed = false
    let keys: string[] = []
    const seq = 'Shift,Shift'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        isCtrlPressed = true
      }

      if (!isVisible) {
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        setVisible(false)
        isCtrlPressed = false
        keys = []
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()

        if (event.key === 'ArrowUp') {
          handleSetFocusedLinkIndex(-1)
        } else {
          handleSetFocusedLinkIndex(+1)
        }
      } else if (event.key !== 'Enter') {
        setFocusedButtonIndex(null)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        isCtrlPressed = false
        keys = []

        return
      }

      keys.push(event.key)

      if (keys.toString().indexOf(seq) !== -1 && isCtrlPressed) {
        if (event.timeStamp && isCtrlPressed) {
          setVisible(true)
          keys = []
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyDown)
    }
  }, [filteredLinks])

  useEffect(() => {
    if (focusedButtonIndex !== null) {
      if (oldFocusedButton) {
        $(oldFocusedButton.element).removeClass(styles.focusedButton)
      }

      const focusedButton = commonFilteredButtons[focusedButtonIndex]

      if (focusedButton) {
        $(focusedButton.element).addClass(styles.focusedButton)
        oldFocusedButton = focusedButton
      }
    }
  }, [focusedButtonIndex, isVisible])

  if (!isVisible) {
    return null
  }

  const handleFocus = () => {
    setFocusedButtonIndex(null)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setFocusedButtonIndex(null)
  }

  return (
    <div
      className={styles.quickCommand}
      id="quick-command"
    >
      <Input
        onChange={handleInputChange}
        isFocused={focusedButtonIndex === null}
        onFocus={handleFocus}
        defaultValue={inputValue}
      />
      {commonFilteredButtons.length > 0 && (
        <div className={styles.result}>
          <Buttons
            buttons={commonFilteredButtons}
            focusedButtonIndex={focusedButtonIndex}
          />
        </div>
      )}
    </div>
  )
}

export default QuickCommand