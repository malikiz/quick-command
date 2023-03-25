import React, { FC, useEffect, useRef } from 'react'

export interface ILink {
  text: string
  url: string
}

export interface ILinkProps {
  link: ILink,
  isFocused: boolean
}

const Link: FC<ILinkProps> = (props) => {
  const {
    link,
    isFocused
  } = props

  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (linkRef.current && isFocused) {
      linkRef.current.focus()
    }
  }, [isFocused])

  return (
    <a href={link.url} ref={linkRef}>
      {link.text}
    </a>
  )
}

export default Link