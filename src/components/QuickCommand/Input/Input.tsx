import React, { FC, useEffect, useRef } from 'react'
import styles from './Input.module.scss'

interface IInputProps {
  onChange: (value: string) => void
  isFocused: boolean
  onFocus: () => void
  defaultValue?: string
}

const Input: FC<IInputProps> = (props) => {
  const { onChange, isFocused, onFocus, defaultValue } = props
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
        onChange={(event) => {
          onChange(event.target.value)
        }}
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