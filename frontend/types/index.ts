import { type } from "os";
import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    type: "button" | "submit" | "reset" | undefined;
    title: string;
    styles?: "main_btn" | "invite_btn" | undefined;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    }

export interface CustomFormProps {
    title: string;
    children: React.ReactNode;
    }