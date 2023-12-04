import React from 'react'

/* Import Styles */
import "@styles/tabs.css";

/**
 * 
 * @param param The title of the tab.
 * @returns A JSX Element that represents a single tab.
 */
export function SingleTab( { title, onClick, style }
  : { title: string, onClick: React.MouseEventHandler<HTMLButtonElement>, style: string } ) 
  : React.JSX.Element
{
  return (
    <li className={"tab_li " + style } role="presentation">
        <button 
            onClick={onClick}
            className="tab_a" 
            type="button" 
            role="tab" >
                {title}
        </button>
    </li>
  )
}

export default SingleTab;
