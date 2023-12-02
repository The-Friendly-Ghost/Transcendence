"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const logout = () => {
  console.log("Logging in with 42");
  console.log("process.env.BACKEND_HOST:", process.env.BACKEND_HOST);
  const authLogoutUrl: string = `${process.env.BACKEND_URL}/auth/logout`;
  window.location.href = authLogoutUrl;
};

/**
 * @returns A JSX Element that represents the Navigation Bar.
 */
export default function nav(): React.JSX.Element {
  return (
    <nav className="flex items-center justify-center w-full bg-transparant h-14">
      <Link href="/" className="px-5 text-white font-inter font-semibold">
        Home
      </Link>

      <Link href="#" className="px-5 text-white font-inter font-semibold">
        About
      </Link>

      <Link href="/play" className="px-5 pt-4 text-white hover:text-slate-900 font-inter font-semibold 
      bg-black/30 hover:bg-white
      shadow-black/50 hover:shadow-col4
      rounded-b-[100px] transition-bg-gradient transition-all duration-300 hover:duration-100
      text-center h-full w-[200px] shadow-2xl">
        Play Game
      </Link>

      <Link href="/chat" className="px-5 text-white font-inter font-semibold" >
        Chat
      </Link>

      <Link href="#" className="px-5 text-white font-inter font-semibold" onClick={logout}>
        LOGOUT
      </Link>
    </nav>
  );
};
