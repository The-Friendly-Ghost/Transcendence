import { CustomFormProps } from '@types'
import React from 'react'

const customButtom = ({ type, title, styles, handleClick }: CustomButtonProps) => {
  return (
    <button 
        type={type}
        className={styles}
        onClick={handleClick}
    >
    <span>
        {title}
    </span>
    </button>
  )
}

export default customButtom