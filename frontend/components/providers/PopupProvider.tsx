"use client";
import React, { createContext, useState, useContext } from 'react';

const PopupContext = createContext<any>(null);

export const PopupProvider = ({ children }: any) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const openPopup = (data: any) => {
        console.log("open popup");
        console.log(data);
        setData(data);
        setIsPopupOpen(true)
    };
  const closePopup = () => {
        console.log("close popup");
        setData(null);
        setIsPopupOpen(false)
    };

  return (
    <PopupContext.Provider value={{ isPopupOpen, data, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
