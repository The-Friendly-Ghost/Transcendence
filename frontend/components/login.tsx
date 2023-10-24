
/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

/* Import Components */
import React from "react";
import CustomButton from "@components/utils/customButtom";


const loginWith42 = () => {
  console.log("Logging in with 42");
  console.log("process.env.BACKEND_HOST:", process.env.BACKEND_HOST);
  const authUrl: string = `${process.env.BACKEND_URL}/auth`;
  window.location.href = authUrl;
};

const login = () => {
  return (
    <section className="container_full_centered">
      <div className="items-start border-l-4 border-violet-900 pl-8 py-8 min-w-min">
        <p className="text_font">Codam The Last Chapter:</p>
        <h1 className="h1_font">Transcendence</h1>
        <CustomButton 
          type = "button"
          title = "Login with 42"
          styles = "main_btn"
          handleClick = {loginWith42}
        />
      </div>
    </section>
  );
};

export default login;
