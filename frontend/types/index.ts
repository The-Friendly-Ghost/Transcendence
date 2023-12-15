import { Socket } from "socket.io-client";

export interface CustomButtonProps {
    type: "button" | "submit" | "reset" | undefined;
    title: string;
    styles?: "main_btn" | "invite_btn" | undefined;
    handleClick?: () => void;
    }

export interface ChatProps {
    setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
    currentRoom?: string;
    key?: number;
    room?: any;
    chatSocket: Socket | null,
    userName: string,
    myIntraId: string,
    }

// export interface CustomFormProps {
//     title: string;
//     children: React.ReactNode;
//     }