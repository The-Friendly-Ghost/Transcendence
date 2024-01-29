import React from "react";

interface popupContextType {
    isPopupOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
    };

export const PopupContext = React.createContext<popupContextType | undefined>(undefined);
