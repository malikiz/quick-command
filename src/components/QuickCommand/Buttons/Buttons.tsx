import React, { FC, RefObject } from 'react'
import Button, { IButton } from './Button'
import styles from './Buttons.module.scss'
import Link, { ILink } from './Link'

interface IButtonsProps {
  buttons: IButton[]
  focusedButton: IButton | null
  focusedButtonRef: RefObject<HTMLButtonElement | HTMLAnchorElement>
}

const Buttons: FC<IButtonsProps> = (props) => {
  const { buttons, focusedButton, focusedButtonRef } = props

  return (
    <div className={styles.buttons}>
      {buttons.map((button, index) => {
        const isFocused = focusedButton === button

        if ((button as ILink).url) {
          return (
            <Link
              innerRef={isFocused ? focusedButtonRef as RefObject<HTMLAnchorElement> : undefined}
              link={button as ILink}
              key={index}
              isFocused={isFocused}
            />
          )
        }

        return (
          <Button
            innerRef={isFocused ? focusedButtonRef as RefObject<HTMLButtonElement> : undefined}
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