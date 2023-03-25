import React, { ChangeEvent, FC, KeyboardEventHandler, useEffect, useRef } from 'react'
import styles from './Input.module.scss'

interface IInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  isFocused: boolean
  onFocus?: () => void
  defaultValue?: string
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}

const Input: FC<IInputProps> = (props) => {
  const { onChange, isFocused, onFocus, defaultValue, onKeyDown } = props
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus()
    }
  }, [isFocused])
  
  return (
    <div className={styles.input}>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        onFocus={onFocus}
        defaultValue={defaultValue}
        onBlur={event => {
          event.stopPropagation()
          event.preventDefault()
        }}
      />
    </div>
  )
}

export default Input