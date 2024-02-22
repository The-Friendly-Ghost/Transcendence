/* import Styles */
import "@styles/fonts.css";

/* import Components */
import React from "react";
import Image from "next/image";

function userInfo(props: any) {
  let image = null;

  function checkAvatar(userinfo: any): string {
    if (userinfo.avatar == null) return props.intraImage;
    else {
      const { buffer, mimetype } = userinfo.avatar;
      return `data:${mimetype};base64,${buffer}`;
    }
  }

  image = checkAvatar(props);

  return (
    <div>
      <h2 className="dashboard-block-title">User Info</h2>
      <div className="dashboard-block-content grid grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col justify-center">
          {image && (
            <Image
              src={image}
              alt="User Avatar"
              width={450}
              height={450}
              className="rounded-lg mb-2"
              priority={true}
            />
          )}
          {/* <img className='rounded-lg mb-2' src={props.avatar} alt="User Avatar" /> */}
        </div>
        <div className="col-span-1grid grid-cols-1 gap-2 content-start">
          <h3 className="font-bold mb-1">Intra ID</h3>
          <p className="text-white/60 mb-4">
            {props.intraId ? props.intraId : "-"}
          </p>
          <h3 className="font-bold mb-1">Username</h3>
          <p className="text-white/60">{props.info ? props.info : "-"}</p>
        </div>
      </div>
    </div>
  );
}

export default userInfo;
