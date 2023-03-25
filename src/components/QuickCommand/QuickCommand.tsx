import React, { useEffect, useState } from 'react'
import styles from './QuickCommand.module.scss'
import Input from './Input/Input'
import Links from './Links/Links'
import { ILink } from './Links/Link'
import $ from 'jquery'
import fuzzy from 'fuzzy'

const findAllLinks = (): ILink[] => {
  const links: ILink[] = []

  $('a').each(function() {
    const $link = $(this)
    const text = $link.text()
    const href = $link.attr('href')

    if (href && !$link.parents('#quick-command').length) {
      links.push({
        url: href,
        text,
      })
    }
  })

  return links
}

const filterAllLinks = (links: ILink[], value: string): ILink[] => {
  if (!value) {
    return []
  }

  return fuzzy.filter(value, links, {
    pre: '<b>',
    post: '</b>',
    extract(input: ILink): string {
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
  const [allLinks, setAllLinks] = useState<ILink[]>([])
  const [focusedLinkIndex, setFocusedLinkIndex] = useState<number | null>(null)
  const filteredLinks = filterAllLinks(allLinks, inputValue)

  const handleSetFocusedLinkIndex = (incrementValue: number) => {
    const value = (focusedLinkIndex ?? -1) + incrementValue

    if (value < 0) {
      setFocusedLinkIndex(null)
    } else {
      const newValue = Math.max(0, Math.min(value, filteredLinks.length - 1))
      setFocusedLinkIndex(newValue)
    }
  }

  useEffect(() => {
    setAllLinks(findAllLinks())
  }, [])

  useEffect(() => {
    let isCtrlPressed = false
    let keys: string[] = []
    const seq = 'Shift,Shift'
    let lastEntry = 0

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        isCtrlPressed = true
      }

      if (event.key === 'Escape') {
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
      } else {
        setFocusedLinkIndex(null)
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


  if (!isVisible) {
    return null
  }

  const handleFocus = () => {
    setFocusedLinkIndex(null)
  }


  return (
    <div className={styles.quickCommand} id="quick-command">
      <Input onChange={setInputValue} isFocused={focusedLinkIndex === null} onFocus={handleFocus} defaultValue={inputValue} />
      {filteredLinks.length > 0 && (
        <div className={styles.result}>
          <Links links={filteredLinks} focusedLinkIndex={focusedLinkIndex} />
        </div>
      )}
    </div>
  )
}

export default QuickCommand