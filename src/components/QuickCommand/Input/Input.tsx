import React, { FC } from 'react'
import styles from './Input.module.scss'

interface IInputProps {
  onChange: (value: string) => void
}

const Input: FC<IInputProps> = ({ onChange }) => {
  return (
    <div className={styles.input}>
      <input type="text" onChange={(event) => {
        onChange(event.target.value)
      }} autoFocus />
    </div>
  )
}

export default Input