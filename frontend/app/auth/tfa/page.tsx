"use client";

/* Import Components */
import { FormEvent, useState } from "react";

/* Import Global Variables */
import { userLoggedIn } from "@app/g_vars";

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

function onSubmit(event: FormEvent<HTMLFormElement>) {
  // event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const tfa_code = formData.get("tfa_code");
  // // Voer hier de actie uit die je wilt doen met de ingevoerde waarde
  console.log(tfa_code);
  console.log("Submitting 2FA code");
}

const tfa_page = () => {
  const [inputValue, setInputValue] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("Setting input value");
    setInputValue(event.target.value);
    console.log("inputValue:", inputValue);
  }

  return (
    <section className="container_full_centered">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          // name="tfa_code"
          value={inputValue}
          onChange={handleChange}
          className="p-2 w-full rounded-md text-black"
          placeholder="2FA code"
        />
        <button type="submit" className="main_btn">
          Verify
        </button>
      </form>
    </section>
  );
};

export default tfa_page;
