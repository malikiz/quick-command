import React, { FC } from 'react'
import Link, { ILink } from './Link'
import styles from './Links.module.scss'

interface ILinksProps {
  links: ILink[]
  focusedLinkIndex: number | null
}

const Links: FC<ILinksProps> = (props) => {
  const { links, focusedLinkIndex } = props

  return (
    <div className={styles.links}>
      {links.map((link, index) => {
        return (<Link link={link} key={index} isFocused={focusedLinkIndex === index} />)
      })}
    </div>
  )
}

export default Links