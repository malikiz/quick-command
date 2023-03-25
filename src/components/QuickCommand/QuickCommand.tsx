import React, { useEffect, useState } from 'react'
import styles from './QuickCommand.module.scss'
import Input from './Input/Input'
import Links from './Links/Links'
import { ILink } from './Links/Link'
import $ from 'jquery'

const findLinks = (value: string): ILink[] => {
  const links: ILink[] = []

  if (!value) {
    return []
  }

  $('a').each(function() {
    const $link = $(this)
    const text = $link.text()
    const href = $link.attr('href')

    if (text.toLowerCase().includes(value.toLowerCase()) && href && !$link.parents('#quick-command').length) {
      links.push({
        url: href,
        text,
      })
    }
  })

  return links
}

const keyboardController = (options: {
  onOpen: () => void,
  onClose: () => void
  onSelect: (key: 'ArrowUp' | 'ArrowDown') => void
}) => {
  let keys: string[] = []
  let lastEntry = 0
  const seq = 'Shift,Shift'
  let isCtrlPressed = false


  $(document).on('keydown', function (e) {
    if (e.key === 'Control') {
      isCtrlPressed = true
    }

    if (e.key === 'Escape') {
      options.onClose()
    }
  })
  $(document).on('keyup', function(event) {
    if (event.key === 'Control') {
      isCtrlPressed = false

      return
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      options.onSelect(event.key)
    }

    keys.push(event.key)

    if ( keys.toString().indexOf(seq) !== -1 && isCtrlPressed) {
      if (event.timeStamp - lastEntry <= 300) {
        options.onOpen()
        keys = []
      }
    }
    // Update time of last keydown
    lastEntry = event.timeStamp
  })
}

const QuickCommand = () => {
  const [isVisible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [links, setLinks] = useState<ILink[]>([])
  const [focusedLinkIndex, setFocusedLinkIndex] = useState<number | null>(null)

  useEffect(() => {
    keyboardController({
      onOpen: () => {
        setFocusedLinkIndex(null)
        setVisible(true)
      },
      onClose: () => {
        setFocusedLinkIndex(null)
        setVisible(false)
      },
      onSelect: (key) => {
        if (key === 'ArrowUp') {
          setFocusedLinkIndex((focusedLinkIndex ?? -1) - 1)
        }

        if (key === 'ArrowDown') {
          setFocusedLinkIndex((focusedLinkIndex ?? -1) + 1)
        }
      }
    })

    return () => {
      $(document).off('keyup, keyup')
    }
  })

  useEffect(() => {
    setLinks(findLinks(inputValue))
  }, [inputValue])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.quickCommand} id="quick-command">
      <Input onChange={setInputValue} />
      {links.length > 0 && (
        <div className={styles.result}>
          <Links links={links} focusedLinkIndex={focusedLinkIndex} />
        </div>
      )}
    </div>
  )
}

export default QuickCommand