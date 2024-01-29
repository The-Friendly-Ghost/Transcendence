import { PopupContext } from "@contexts/PopupContext";
import React from "react";

export type PopupProviderProps = {
    children: React.ReactNode;
  };

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    return (
        <PopupContext.Provider value={{ isPopupOpen, openPopup, closePopup }}>
            {children}
        </PopupContext.Provider>
    );
};
