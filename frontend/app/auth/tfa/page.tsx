"use client";
/* Import Components */
import { useState } from "react";

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

/* Import Functions */
import { useRouter } from "next/navigation";
import { verifyTfaCode } from "@app/ServerUtils";

export default function tfa_page() {
  const router = useRouter();
  const [tfa_code, setTfaCode] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const isVerified: boolean = await verifyTfaCode(tfa_code);
    if (isVerified) router.push("/");
    else alert("Wrong 2FA code");
  };

  return (
    <section className="container_full_centered">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          onChange={(e) => setTfaCode(e.target.value)}
          className="p-2 w-full rounded-md text-black"
          placeholder="2FA code"
        />
        <button type="submit" className="main_btn">
          Verify
        </button>
      </form>
    </section>
  );
}
