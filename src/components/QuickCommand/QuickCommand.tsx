import React, { useEffect, useState } from 'react'
import styles from './QuickCommand.module.scss'
import Input from './Input/Input'
import Links from './Links/Links'
import { ILink } from './Links/Link'
import $ from 'jquery'
import fuzzy from 'fuzzy'
import { IButton } from './Buttons/Button'
import Buttons from './Buttons/Buttons'

let oldFocusedButton: ILink

const getText = ($element: JQuery<HTMLElement>): string => {
  return $element.text() || $element.attr('title') || $element.attr('aria-label') || $element.siblings().text() || $element.parent().text() || $element.parents().text() || ''
}

const findLinks = (): ILink[] => {
  const links: ILink[] = []

  $('a').each(function() {
    const $link = $(this)
    const text = getText($link)
    const href = $link.attr('href')

    if (href && !$link.parents('#quick-command').length) {
      links.push({
        element: $link[0],
        url: href,
        text,
      })
    }
  })

  return links
}

const findButtons = (): IButton[] => {
  const buttons: IButton[] = []

  $('button, div[role="button"]').each(function() {
    const $button = $(this)
    const text = getText($button)

    if (!$button.parents('#quick-command').length) {
      buttons.push({
        element: $button[0],
        text,
      })
    }
  })

  return buttons
}

const filterAllButtons = <T extends { string?: string; text: string }>(links: T[], value: string): T[] => {
  return fuzzy.filter(value, links, {
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
  const filteredLinks = filterAllButtons(allLinks, inputValue)
  const filteredButtons = filterAllButtons(allButtons, inputValue)
  const commonLength = filteredLinks.length + filteredButtons.length

  const handleSetFocusedLinkIndex = (incrementValue: number) => {
    const value = (focusedButtonIndex ?? -1) + incrementValue

    if (value < 0) {
      setFocusedButtonIndex(null)
    } else {
      const newValue = Math.max(0, Math.min(value, commonLength - 1))
      setFocusedButtonIndex(newValue)
    }
  }

  useEffect(() => {
    setAllLinks(findLinks())
    setAllButtons(findButtons())
  }, [inputValue])

  useEffect(() => {
    let isCtrlPressed = false
    let keys: string[] = []
    const seq = 'Shift,Shift'
    let lastEntry = 0

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        isCtrlPressed = true
      }

      if (!isVisible) return
      if (event.key === 'Escape') {
        event.preventDefault()
        setVisible(false)
        isCtrlPressed = false
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

        return
      }

      keys.push(event.key)

      if (keys.toString().indexOf(seq) !== -1 && isCtrlPressed) {
        if (event.timeStamp - lastEntry <= 300) {
          setVisible(true)
          keys = []
        }
      }
      // Update time of last keydown
      lastEntry = event.timeStamp
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

      const focusedButton = filteredLinks[focusedButtonIndex] ?? filteredButtons[focusedButtonIndex - filteredLinks.length]

      $(focusedButton.element).addClass(styles.focusedButton)
      oldFocusedButton = focusedButton
    }
  }, [focusedButtonIndex, isVisible])


  if (!isVisible) {
    return null
  }

  const handleFocus = () => {
    setFocusedButtonIndex(null)
  }


  return (
    <div className={styles.quickCommand} id="quick-command">
      <Input onChange={setInputValue} isFocused={focusedButtonIndex === null} onFocus={handleFocus} defaultValue={inputValue} />
      {(filteredLinks.length > 0 || filteredButtons.length > 0) && (
        <div className={styles.result}>
          <Links before={0} links={filteredLinks} focusedLinkIndex={focusedButtonIndex} />
          <Buttons before={filteredLinks.length} buttons={filteredButtons} focusedButtonIndex={focusedButtonIndex} />
        </div>
      )}
    </div>
  )
}

export default QuickCommand