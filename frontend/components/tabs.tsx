import React from 'react'

/* Import Styles */
import "@styles/tabs.css";

/**
 * 
 * @param toggleId The id of the element you want to toggle. 
 * a.k.a. the id of the div that contains the content of the tabs.
 * @returns A JSX Element that represents the tabs overview.
 */
export function TabsOverview({ children }
    : { children: React.ReactNode })
    : React.JSX.Element 
{
  return (
    <ul className="tab_ul">
        {children}
    </ul>
  )
}

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

export default TabsOverview
