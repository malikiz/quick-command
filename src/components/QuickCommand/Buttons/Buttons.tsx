import React, { FC } from 'react'
import Button, { IButton } from './Button'
import styles from './Buttons.module.scss'
import Link, { ILink } from './Link'

interface IButtonsProps {
  buttons: (IButton | ILink)[]
  focusedButtonIndex: number | null
}

const Buttons: FC<IButtonsProps> = (props) => {
  const { buttons, focusedButtonIndex } = props
  console.log(focusedButtonIndex)

  return (
    <div className={styles.buttons}>
      {buttons.map((button, index) => {
        const isFocused = focusedButtonIndex === index

        if ((button as ILink).url) {
          return (
            <Link
              link={button as ILink}
              key={index}
              isFocused={isFocused}
            />
          )
        }

        return (
          <Button
            button={button as IButton}
            key={index}
            isFocused={isFocused}
          />
        )
      })}
    </div>
  )
}

export default Buttons