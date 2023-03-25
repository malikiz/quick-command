import React, { FC } from 'react'
import Link, { ILink } from './Link'
import styles from '../Buttons/Buttons.module.scss'

interface ILinksProps {
  before: number
  links: ILink[]
  focusedLinkIndex: number | null
}

const Links: FC<ILinksProps> = (props) => {
  const { links, focusedLinkIndex } = props

  return (
    <div className={styles.buttons}>
      {links.map((link, index) => {
        return (<Link link={link} key={index} isFocused={focusedLinkIndex === index} />)
      })}
    </div>
  )
}

export default Links