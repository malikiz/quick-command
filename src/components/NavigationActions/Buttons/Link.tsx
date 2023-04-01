import React, { FC, MouseEventHandler, RefObject } from 'react'
import HTMLReactParser from 'html-react-parser'
import styles from './Buttons.module.scss'
import classNames from 'classnames'
import { IButton } from './Button'

export interface ILink extends IButton {
  url: string
}

export interface ILinkProps {
  link: ILink,
  isFocused: boolean
  innerRef?: RefObject<HTMLAnchorElement>
}

const Link: FC<ILinkProps> = (props) => {
  const {
    link,
    innerRef,
    isFocused,
  } = props

  const onClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    link.element.click()
  }

  return (
    <a
      href={link.url}
      ref={innerRef}
      className={classNames({ [styles.focused]: isFocused })}
      onClick={onClick}
    >
      {link.string ? HTMLReactParser(link.string) : link.text}
    </a>
  )
}

export default Link