"use client";
// import { PopupStateContext, usePopup } from "@contexts/PopupContext";
import { acceptInvite } from "@app/ServerUtils";
import { usePopup } from "@components/providers/PopupProvider";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

export const Popup: React.FC = () => {
    const { isPopupOpen, data, closePopup } = usePopup();
    const router = useRouter();

    function acceptButton() {
      console.log("accept button");
        acceptInvite(data?.inviteId);
        router.push("/play");
        closePopup();
    };

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
        <p></p>
        <button onClick={acceptButton}>Accept</button>
      </div>
    );
  };
