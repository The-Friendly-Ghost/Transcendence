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
    let type: string = props.type? props.type : "text";

    return (
        <input
            type={type}
            value={input}
            onChange={e => setInput(e.target.value)}
            className={"w-full px-3 h-12 bg-transparent border rounded-md text-white focus:outline-none"}
            placeholder={placeholder}
        />
    )
}

export default InputSimple
