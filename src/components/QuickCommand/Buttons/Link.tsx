import React, { FC, useEffect, useRef } from 'react'
import HTMLReactParser from 'html-react-parser'

export interface ILink {
  element: Element
  text: string
  parentText?: string
  url: string
  string?: string
}

export interface ILinkProps {
  link: ILink,
  isFocused: boolean
}

const Link: FC<ILinkProps> = (props) => {
  const {
    link,
    isFocused,
  } = props

  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (linkRef.current && isFocused) {
      linkRef.current.focus()
    }
  }, [isFocused])

  return (
    <a
      href={link.url}
      ref={linkRef}
    >
      {link.string ? HTMLReactParser(link.string) : link.text}
    </a>
  )
}

export default Link