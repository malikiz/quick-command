import React, { FC } from 'react'
import Button, { IButton } from './Button'
import styles from './Buttons.module.scss'

interface IButtonsProps {
  before: number
  buttons: IButton[]
  focusedButtonIndex: number | null
}

const Buttons: FC<IButtonsProps> = (props) => {
  const { buttons, focusedButtonIndex, before } = props

  return (
    <div className={styles.buttons}>
      {buttons.map((button, index) => {
        return (<Button button={button} key={index} isFocused={focusedButtonIndex === (before + index)} />)
      })}
    </div>
  )
}

export default Buttons