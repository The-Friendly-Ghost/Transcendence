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
    <nav className="flex items-center justify-center w-full pt-3 bg-blue-500 h-14">
      <Link href="/" className="px-5">
        <Image
          className={"object-contain"}
          src={"/assets/images/logo.svg"}
          alt={"Trancendance"}
          width={50}
          height={50}
        />
        Home
      </Link>

      <Link href="#" className="px-5">
        About
      </Link>

      <Link href="/play" className="px-5">
        Play Game
      </Link>

      <Link href="/chat" className="px-5" >
        Chat
      </Link>

      <Link href="#" className="px-5" onClick={logout}>
        LOGOUT
      </Link>
    </nav>
  );
};
