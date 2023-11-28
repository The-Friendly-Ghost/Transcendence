import React from 'react'

/**
 * 
 * @param props The props of the button. 
 * Accepted props:
 * - summary: string
 * - content: JSX.Element
 * @returns A JSX Element that represents a standard button.
 */
export function SmallAccordion(props: any) : React.JSX.Element
{
    // Set the default values of the props
    let summary: string = props.summary? props.summary : "Summary Here";
    let content: any = props.content? props.content : <p>[Content Here]</p>;

    return (
        <details className='mb-2'>
            <summary className='text-xl mb-2'>{summary}</summary>
            {content}
        </details>
    )
};

export default SmallAccordion
{/* <InputSimple 
input={userName} 
setInput={setUserName}
/> */}