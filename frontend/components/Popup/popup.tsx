import { PopupProviderProps } from "@components/providers/PopupProvider";
import { PopupContext } from "@contexts/PopupContext";
import React from "react";

export const Popup: React.FC = () => {
    const popupContext = React.useContext(PopupContext);
    if (popupContext && !popupContext.isPopupOpen) {
      return null;
    }
    return (
      <div>
        <p>This is a popup!</p>
        <button onClick={popupContext?.closePopup}>Close</button>
      </div>
    );
  };
