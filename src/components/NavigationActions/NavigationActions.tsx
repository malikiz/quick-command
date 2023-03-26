import React, { ChangeEvent, FC, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import styles from './NavigationActions.module.scss'
import Input from './Input/Input'
import $ from 'jquery'
import { IButton } from './Buttons/Button'
import Buttons from './Buttons/Buttons'
import filterAllButtons from './utils/filterAllButtons'
import findLinks from './utils/findLinks'
import findButtons from './utils/findButtons'
import useObserver from './hooks/useObserver'

interface INavigationActionsProps {
  setVisible: (value: boolean) => void;
  isVisible: boolean
}

const NavigationActions: FC<INavigationActionsProps> = (props) => {
  const { setVisible } = props
  
  const [inputValue, setInputValue] = useState('')
  const [allButtons, setAllButtons] = useState<IButton[]>([])
  const [allLinks, setAllLinks] = useState<IButton[]>([])
  const [focusedButtonIndex, setFocusedButtonIndex] = useState<number>(0)
  const [focusedButton, setFocusedButton] = useState<IButton | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const observerTick = useObserver()

  const filteredLinks = filterAllButtons(allLinks, inputValue)
  const filteredButtons = filterAllButtons(allButtons, inputValue)
  const commonFilteredButtons = filteredLinks.concat(filteredButtons)

  const handleSetFocusedLinkIndex = (incrementValue: number) => {
    const value = (focusedButtonIndex ?? -1) + incrementValue

    if (value < 0) {
      setFocusedButtonIndex(0)
    } else {
      const newValue = Math.max(0, Math.min(value, commonFilteredButtons.length - 1))

      setFocusedButtonIndex(newValue)
    }
  }

  useEffect(() => {
    setLoading(true)
    setAllLinks(findLinks())
    setAllButtons(findButtons())
    setLoading(false)
  }, [observerTick])

  useEffect(() => {
    if (focusedButton) {
      $(focusedButton.element).removeClass(styles.focusedButton)
    }

    const newFocusedButton = commonFilteredButtons[focusedButtonIndex] ?? commonFilteredButtons[0]

    if (newFocusedButton) {
      $(newFocusedButton.element).addClass(styles.focusedButton)

      const scrollTop = ($(newFocusedButton.element).offset()?.top ?? 0) - ($('#quick-command').outerHeight(true) ?? 0) - 100

      $(document.documentElement).stop(true).animate({
        scrollTop: scrollTop
      }, 100)

      setFocusedButton(newFocusedButton)
    }
  }, [focusedButtonIndex, commonFilteredButtons])

  useEffect(() => {
    if (focusedButton && focusedButton !== commonFilteredButtons[focusedButtonIndex]) {
      const newFocusedButtonIndex = commonFilteredButtons.findIndex(value => {
        return value === focusedButton
      }) ?? 0

      setFocusedButtonIndex(Math.max(0, newFocusedButtonIndex))
    }
  }, [commonFilteredButtons.length])

  const focusedButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setVisible(false)
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()

      if (event.key === 'ArrowUp') {
        handleSetFocusedLinkIndex(-1)
        setDirection('up')
      } else {
        handleSetFocusedLinkIndex(+1)
        setDirection('down')
      }
    } else if (event.key === 'Enter') {
      if (focusedButtonRef.current) {
        focusedButtonRef.current.click()
      }
    }
  }

  const handleInputBlur = () => {
    // setVisible(false)
  }

  return (
    <div
      className={styles.quickCommand}
      id="quick-command"
    >
      <Input
        onChange={handleInputChange}
        isFocused
        defaultValue={inputValue}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
      />
      <>
        {isLoading ? 'Loading...' : (
          commonFilteredButtons.length > 0 && (
            <div className={styles.result}>
              <Buttons
                focusedButtonRef={focusedButtonRef}
                buttons={commonFilteredButtons}
                focusedButton={focusedButton}
                direction={direction}
              />
            </div>
          )
        )}
      </>
    </div>
  )
}

export default NavigationActions