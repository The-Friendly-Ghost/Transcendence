"use client"

/* Import Components */
import UserInfo from '@components/dashboard/userInfo';
import Play from '@components/dashboard/play';
import Friends from '@components/dashboard/friends';
import Stats from './Stats';

/* Import functions and library */
import { getCookie, getSecret, getUserInfo } from '@app/ServerUtils'
import { useEffect, useState } from 'react';
import React from 'react';

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';
import '@styles/dashboard.css'
import Settings from './Settings';
import { useSocket } from '@contexts/SocketContext';
import { Socket } from 'socket.io-client';
import StandardButton from '@components/common/Buttons';
import { post, put } from '@utils/request/request';

export function dashboard() {

  /* ********************* */
  /* Init State Variables */
  /* ******************* */

  const [userInfo, setUserInfo] = useState<any>([]);
  // The socket to send and receive messages
  const socket: Socket | null = useSocket();
  const [mySecret, setMySecret] = useState<any>([]);

  /* ********************* */
  /* UseEffect Hooks      */
  /* ******************* */

  // This useEffect is used to get the chat rooms from the backend
  useEffect(() => {
    getUserInfo().then((userInfo) => {
      setUserInfo(userInfo);
      socket?.emit("test", {"test": "test"});
    });
  }, []);

  useEffect(() => {
    const fetchSecret = async () => {
      const secret = await getSecret(userInfo.intraId);
      setMySecret(secret);
    }
    fetchSecret();
  }, [userInfo]);


  return (
	<div className='dashboard_grid'>
    <div className='dashboard_block'>
      <UserInfo
        info = {userInfo.name}
        avatar = {userInfo.image_url}
        intraId = {userInfo.intraId}
      />
    </div>
    <div className='dashboard_block h-full'>
      <Stats
        wins = {userInfo.wins}
        losses = {userInfo.losses}
      />
    </div>
    <div className='dashboard_block'>
      <Friends
        friends = {userInfo.friends}
      />
    </div>
    <div className='dashboard_block'>
      <Settings />
    </div>
    <div className='dashboard_block'>
      <p>
        2FA Secret: {mySecret.secret}
      </p>
					<StandardButton
						onClick={ () => post('/auth/2fa/toggle/' + userInfo.intraId) }
						text={"Toggle 2FA ON/OFF"}
						buttonStyle={"w-[200px] border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
					/>
    </div>
  </div>
  )
}

export default dashboard
