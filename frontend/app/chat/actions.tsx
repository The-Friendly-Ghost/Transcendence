import { io, Socket } from 'socket.io-client';

/**
 * 
 * @param event The event that triggered the function
 * @param newUserName The new user name
 * @param setUserName The function to set the user name
 * @param chatSocket The socket to send and receive messages
 * @param userName The user name of the user
 * @param intraId The 42 intraId of the user. This Id will stay the same, even if the user changes his name.
 * @param setNewUserName The function to set the new user name
 * @returns Void
 */
export async function changeUserName(
  event: React.FormEvent<HTMLFormElement>,
  newUserName: string,
  setUserName: React.Dispatch<React.SetStateAction<string>>,
  chatSocket: Socket | null,
  userName: string,
  intraId: string,
  setNewUserName: React.Dispatch<React.SetStateAction<string>>
): Promise<void> 
{
  event.preventDefault(); // Prevents the page from reloading
  if (newUserName === "" || newUserName === null ) // If the message is empty, return
    return ;
  setUserName(newUserName);
  chatSocket?.emit('newMessage', { msg: "changed name to " + "\"" + newUserName + "\"", destination: chatSocket.id, userName: userName, intraId: intraId });
  setNewUserName(""); // Clear the message box
}

/**
 * 
 * @param event The event that triggered the function
 * @param chatMessage The message to send
 * @param chatSocket The socket to send and receive messages
 * @param userName The user name of the user
 * @param intraId The 42 intraId of the user. This Id will stay the same, even if the user changes his name.
 * @param setChatMessage The function to set the message to send
 * @returns Void
 */
export async function sendMessage(
    event: React.FormEvent<HTMLFormElement>,
    chatMessage: string,
    chatSocket: Socket | null,
    userName: string,
    intraId: string,
    setChatMessage: React.Dispatch<React.SetStateAction<string>>
  ): Promise<void> {
    event.preventDefault(); // Prevents the page from reloading
    if (chatMessage === "") // If the message is empty, return
      return ;
    chatSocket?.emit('newMessage', { msg: chatMessage, destination: chatSocket.id, userName: userName, intraId: intraId });
    setChatMessage(""); // Clear the message box
  }

/**
* 
* @param getCookie Get the cookie from the browser
* @param setUserName Set the user name
* @param setIntraId Set the intraId
*/
export async function fetchIntraName(
    getCookie: (name: string) => Promise<string>,
    setUserName: React.Dispatch<React.SetStateAction<string>>,
    setIntraId: React.Dispatch<React.SetStateAction<string>>
  )
  : Promise<void> 
{
    const newUserName = await getCookie('username');
    setUserName(newUserName);
    const newIntraId = await getCookie('intraId');
    setIntraId(newIntraId);
  }

/**
 * 
 * @param userName The user name of the user
 * @param setChatSocket The function to set the socket
 */
export async function setupWebSocket(
    userName: string | null,
    setChatSocket: React.Dispatch<React.SetStateAction<Socket | null>>
    )
  : Promise<void> 
{
    const socket = io("http://localhost:3000", {
      query: { token: userName }
    });
    setChatSocket(socket);
  }

/**
 * 
 * @param chatSocket The socket to send and receive messages
 * @param setMessageReceived The function to set the messages received
 */
export function checkReceivedMessage(
    chatSocket: Socket | null,
    setMessageReceived: React.Dispatch<React.SetStateAction<string[]>>
  ): void {
    chatSocket?.on('onMessage', (data: any) => {
      setMessageReceived(prevMessages => [...prevMessages, data.userName + " : " + data.msg]);
    });
  }