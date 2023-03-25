import React, { FC, RefObject } from 'react'
import HTMLReactParser from 'html-react-parser'
import classNames from 'classnames'
import styles from './Buttons.module.scss'

export interface IButton {
  element: HTMLElement
  text: string
  parentText?: string
  string?: string
  url?: string
}

export interface IButtonProps {
  button: IButton,
  isFocused: boolean
  innerRef?: RefObject<HTMLButtonElement>
}

const Button: FC<IButtonProps> = (props) => {
  const {
    button,
    innerRef,
    isFocused,
  } = props

  const onClick = () => {
    button.element.click()
  }

  return (
    <button
      ref={innerRef}
      onClick={onClick}
      className={classNames({ [styles.focused]: isFocused })}
    >
      {button.string ? HTMLReactParser(button.string) : button.text}
    </button>
  )
}

export default Button