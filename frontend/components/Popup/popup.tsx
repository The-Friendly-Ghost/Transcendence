// import { PopupStateContext, usePopup } from "@contexts/PopupContext";
import { usePopup } from "@components/providers/PopupProvider";
import React, { use, useEffect } from "react";

export const Popup: React.FC = () => {
    const { isPopupOpen, data, closePopup } = usePopup();

    useEffect(() => {
        console.log("Popup mounted");
        return () => {
            console.log("Popup unmounted");
        }
    }, []);

    if (!isPopupOpen) {
      return null;
    }

    return (
      <div>
        <p>This is a popup! You have been invited by {data?.senderName}!</p>
        <button onClick={closePopup}>Close</button>
      </div>
    );
  };
