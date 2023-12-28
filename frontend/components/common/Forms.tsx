import React from 'react'

/**
 * 
 * @param props The props of the button.
 * Accepted props:
 * - onSubmit: function
 * - content: JSX.Element
 * @returns 
 */
function SimpleForm(props: any) {
  return (
    <form onSubmit={props.onSubmit} >
        {props.content}
    </form>
  )
}

export default SimpleForm