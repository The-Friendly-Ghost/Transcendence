/* Import React or Library functions */
import React from 'react'

/* Import Styles */
import "@styles/buttons.css";

/**
 * 
 * @param props The props of the button. 
 * Accepted props:
 * - disabled: boolean
 * - onClick: function
 * - text: string
 * - type: string
 * - buttonStyle: string
 * @returns A JSX Element that represents a standard button.
 */
export function StandardButton(props: any): React.JSX.Element {

    // Set the default values of the props
    let buttonStyle: string = props.buttonStyle? "main_btn " + props.buttonStyle : "main_btn"
    let type: "submit" | "button" | "reset" | undefined = props.type? props.type : "submit";
    let disabled: boolean = props.disabled? props.disabled : false;
    let onClick: React.MouseEventHandler<HTMLButtonElement> | undefined = props.onClick? props.onClick : () => {};
    let text: string = props.text? props.text : "Submit";
  
    // If the button is disabled, return a disabled button
    if (disabled === true) {
      return (
        <button
          disabled={true}
          className={"disabled_btn"}
        >
          {text}
        </button>
      )
    }
    // If the button is not disabled, return a normal button
    else
    {
        return (
            <button
                disabled={false}
                type={type}
                onClick={onClick}
                className={buttonStyle}
                >
                {text}
            </button>
        )
    }
}

/**
 * 
 * @param props The props of the button. 
 * Accepted props:
 * - buttonStyle: string
 * @returns A JSX Element that represents a standard button.
 */
export function SubmitButton(props: any): React.JSX.Element {

    // Set the default values of the props
    let buttonStyle: string = props.buttonStyle? props.buttonStyle : "send_btn"
    return (
        <button className={buttonStyle} >
            Send
        </button>
    )
}

export default StandardButton