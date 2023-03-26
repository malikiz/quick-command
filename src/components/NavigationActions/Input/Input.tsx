import React, { ChangeEvent, FC, KeyboardEventHandler, RefObject } from 'react'
import styles from './Input.module.scss'

interface IInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  defaultValue?: string
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
  inputRef: RefObject<HTMLInputElement>
}

const Input: FC<IInputProps> = (props) => {
  const { onChange, defaultValue, onKeyDown, onBlur, inputRef } = props

  return (
    <div className={styles.input}>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        defaultValue={defaultValue}
        onBlur={event => {
          event.stopPropagation()
          event.preventDefault()
          onBlur()
        }}
      />
    </div>
  )
}

export default Input