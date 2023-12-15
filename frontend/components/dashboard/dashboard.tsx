"use client"

/* Import Components */
import UserInfo from '@components/dashboard/userInfo';
import Play from '@components/dashboard/play';
import Friends from '@components/dashboard/friends';
import Stats from './Stats';

/* Import functions and library */
import { getCookie, getUserInfo } from '@app/ServerUtils'
import { useEffect, useState } from 'react';
import React from 'react';

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';
import '@styles/dashboard.css'

export function dashboard() {

  /* ********************* */
  /* Init State Variables */
  /* ******************* */

  const [userInfo, setUserInfo] = useState<any>([]);
  
  
  /* ********************* */
  /* UseEffect Hooks      */
  /* ******************* */
  
  // This useEffect is used to get the chat rooms from the backend
  useEffect(() => {
    getUserInfo().then((userInfo) => { 
      setUserInfo(userInfo);
    });
  }, []);

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
      <p>LEADERBOARD</p>
    </div>
    <div className='dashboard_block'>
      <p>2FA</p>
    </div>
  </div>
  )
}

export default dashboard