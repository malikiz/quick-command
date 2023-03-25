import React, { FC } from 'react'
import Link, { ILink } from './Link'

interface ILinksProps {
  links: ILink[]
  focusedLinkIndex: number | null
}

const Links: FC<ILinksProps> = (props) => {
  const { links, focusedLinkIndex } = props

  return (
    <>
      {links.map((link, index) => {
        return (<Link link={link} key={index} isFocused={focusedLinkIndex === index} />)
      })}
    </>
  )
}

export default Links