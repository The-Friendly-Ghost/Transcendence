"use client"

import { useState } from "react";
import { Socket } from "socket.io-client";

interface MenuOverlayProps {
    startVisibility: boolean;
    socket: Socket | null;
    user: string | null;
    gameRoom: number | null;
}

function MenuOverlay({ startVisibility, socket, user, gameRoom }: MenuOverlayProps) {
    const [visible, setVisible] = useState<boolean>(false);





};
