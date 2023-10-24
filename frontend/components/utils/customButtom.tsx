"use client"

// import { CustomButtonProps } from '@types'
import React from 'react'

// export interface CustomButtonProps {
//   type: "button" | "submit" | "reset" | undefined;
//   title: string;
//   styles?: "main_btn" | "invite_btn" | undefined;
//   handleClick?: React.MouseEventHandler<HTMLButtonElement>;
//   }

function customButtom(props: any)
{
  return (
    <button 
        type={props.type}
        className={props.styles}
        onClick={props.handleClick}
    >
    <span>
        {props.title}
    </span>
    </button>
  )
}

export default customButtom