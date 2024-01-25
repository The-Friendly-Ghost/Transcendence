import React, { useEffect, useState } from 'react'

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';
import '@styles/buttons.css';
import InputSimple from '@components/common/Input';
import { addNewFriend, getStatus, getUserInfo } from '@app/ServerUtils';
import Image from 'next/image';
import StandardButton from '@components/common/Buttons';
import SimpleForm from '@components/common/Forms';

async function getFriendsInfo(friends: any, setFriendAmount: React.Dispatch<React.SetStateAction<number>>)
: Promise<any[]>
{
  let friendsInfo: any[] = [];

  if (friends)
  {
    for (const friend of friends)
    {
      const info = await getUserInfo(friend);
      friendsInfo.push(info);
    }
  }
  
  setFriendAmount(friendsInfo.length);
  return friendsInfo;
}


export function Friends(props: any)
{
  const [friendsInfo, setFriendsInfo] = useState<any[]>([]);
  const [newFriend, setNewFriend] = useState<string>("");
  const [friendAmount, setFriendAmount] = useState<number>(0);
  const [status, setStatus] = useState< {[key: string]: boolean} >({});

  useEffect(() => {
    getFriendsInfo(props.friends, setFriendAmount).then(info => setFriendsInfo(info));
  }, [props.friends]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const newStatuses: { [key: number]: boolean } = {};
      for (const friend of friendsInfo) {
          const status = await getStatus(friend.intraId);
          newStatuses[friend.intraId] = status.online;
      }
      setStatus(newStatuses);
    };

    fetchStatuses();
  }, [friendsInfo]);

  return (
    <div>
      <h2 className='dashboard-block-title'>
        Friends
      </h2>

      <div className='dashboard-block-content content-center h-[300px] overflow-y-auto'>
				<div className='mb-6'>
          <p className='pb-3 font-bold'>Add new friends</p>
          
          <SimpleForm
            onSubmit= {() => addNewFriend(newFriend)}
            content = 
            {
              <div className="flex">
                <InputSimple 
                  input={newFriend} 
                  setInput={setNewFriend}
                  placeholder={"Intra-ID"}
                />
                <StandardButton 
                  text={"Add"}
                  buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                />
              </div>
            }
          />


        </div>
        <div className='grid grid-cols-1'>
          <p className='py-3 font-bold'>Your friends ({friendAmount})</p>
          {friendAmount === 0 && (<p>You have no friends yet 😭</p>)}
          {friendsInfo?.map((friend: any) => (
            <div className='flex flex-row flex-wrap gap-4 py-2'>
              <div>
                <Image
                  src={friend.image_url}
                  alt="User Avatar"
                  width={120}
                  height={120}
                  className='rounded-lg'
                />
                {/* <a href="#" className='text-red-600 hover:text-red-400 text-xs'>X Delete friend</a> */}
              </div>
              <div>
                <p className='w-full font-bold'>{friend.name} <span className='text-white/60 text-sm font-normal'>(ID: {friend.intraId})</span></p>
                <p className='w-full text-white/60'>Wins: {friend.wins} - Losses: {friend.losses}</p>
                <p className='w-full text-white/60'>
                  <div className={`inline-block h-3 w-3 mr-2 rounded-full ${status[friend.intraId] ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {status[friend.intraId] ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
          </div>
			</div>

    </div>
  )
}

export default Friends