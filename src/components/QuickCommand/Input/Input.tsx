import React, { FC, useEffect, useRef } from 'react'
import styles from './Input.module.scss'

interface IInputProps {
  onChange: (value: string) => void
  isFocused: boolean
  onFocus: () => void
  defaultValue?: string
}

const Input: FC<IInputProps> = ({ onChange, isFocused, onFocus, defaultValue }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <div className={styles.input}>
      <input type="text" onChange={(event) => {
        onChange(event.target.value)
      }} ref={inputRef} onFocus={onFocus} defaultValue={defaultValue} />
    </div>
  )
}

export default Input