import React from 'react'

/**
 * 
 * @param props The props of the button.
 * Accepted props:
 * - input: string
 * - setInput: function
 * - placeholder: string
 * @returns A JSX Element that represents a simple input field.
 */
export function InputSimple( props: any ) : React.JSX.Element
{
    // Set the default values of the props
    let input: string = props.input? props.input : "";
    let setInput: any = props.setInput? props.setInput : () => {};
    let placeholder: string = props.placeholder? props.placeholder : "";

    return (
        <input
            type={"text"}
            value={input}
            onChange={e => setInput(e.target.value)}
            className={"w-full px-3 h-12 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-bg-violet-700"}
            placeholder={placeholder}
        />
    )
}

export default InputSimple
