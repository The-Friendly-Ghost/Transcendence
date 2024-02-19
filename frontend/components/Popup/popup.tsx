"use client";
// import { PopupStateContext, usePopup } from "@contexts/PopupContext";
import { acceptInvite } from "@app/ServerUtils";
import { usePopup } from "@components/providers/PopupProvider";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

export const InvitePopup: React.FC = () => {
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
      <div className="absolute bottom-10 right-20 bg-purple-600/40 p-3 rounded-md hover:scale-[102%] transition-all duration-300 backdrop-blur-md shadow-lg drop-shadow ease-in-out">
        <p className="text-md font-semibold text-wrap">{data?.senderName} sent you an invite!</p>
        <div className="flex justify-around gap-5 pt-3">
        <button className="bg-green-700/80 px-2 rounded-md hover:bg-green-600" onClick={acceptButton}>Accept</button>
        <button className="bg-red-700/80 px-2 rounded-md hover:bg-red-600" onClick={closePopup}>Close</button>
        </div>
      </div>
    );
  };
