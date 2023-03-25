import React, { FC, useEffect, useRef } from 'react'
import HTMLReactParser from 'html-react-parser'

export interface IButton {
  element: HTMLElement
  text: string
  parentText?: string
  string?: string
}

export interface IButtonProps {
  button: IButton,
  isFocused: boolean
}

const Button: FC<IButtonProps> = (props) => {
  const {
    button,
    isFocused,
  } = props

  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (buttonRef.current && isFocused) {
      buttonRef.current.focus()
    }
  }, [isFocused])

  const onClick = () => {
    button.element.click()
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
    >
      {button.string ? HTMLReactParser(button.string) : button.text}
    </button>
  )
}

export default Button