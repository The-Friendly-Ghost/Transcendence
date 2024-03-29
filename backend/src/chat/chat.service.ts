import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaChatService } from './prisma/prisma_chat.service';
import { Chatroom } from '@prisma/client';
import * as argon from 'argon2';
import { Socket } from 'socket.io';
import { GatewayService } from 'src/gateway/gateway.service';

// service for chat endpoints. These functions check permissions 'n stuff
// and
// Input validation is done in prisma_chat.service.ts
@Injectable()
export class ChatService {
  constructor(private prisma_chat: PrismaChatService, private gateway: GatewayService) {}

  async create_chatroom(intraId: number, chatroom_name: string) {
    const chatroom = await this.prisma_chat.create_chatroom(intraId, chatroom_name).catch((e: Error) => {
      throw e;
    });
    return chatroom;
  }

  async create_dm_chatroom(intraId: number, intraId2: number, chatroom_name: string) {
    const chatroom = await this.prisma_chat.create_dm_chatroom(intraId, intraId2, chatroom_name).catch((e: Error) => {
      throw e;
    });
    return chatroom;
  }

  async delete_chatroom(intraId: number, chatroom_name: string) {
    const is_user_admin = await this.prisma_chat
      .is_user_admin(intraId, chatroom_name)
      .catch((e: Error) => {
        throw e;
      });
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    return await this.prisma_chat.delete_chatroom(chatroom_name);
  }

  async add_user_to_chatroom(intraId: number, chatroom_name: string, addedUserIntraId: number) {
    const isUserBanned = await this.prisma_chat.is_user_banned(addedUserIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (isUserBanned === true) {
      throw new Error('User is banned from this chatroom');
    }
    const is_user_admin = await this.prisma_chat
      .is_user_admin(intraId, chatroom_name)
      .catch((e: Error) => {
        throw e;
      });
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    return await this.prisma_chat.add_user_to_chatroom(addedUserIntraId, chatroom_name);
  }

  async remove_user_from_chatroom(deleterId: number, chatroom_name: string, userIntraId: number) {
    const is_user_admin = await this.prisma_chat
    .is_user_admin(deleterId, chatroom_name)
    .catch((e: Error) => {
      throw e;
    });
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    const is_user_owner = await this.prisma_chat.is_user_owner(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_owner === true) {
      return 'You cannot remove the owner';
    }
    return await this.prisma_chat.remove_user_from_chatroom(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
  }

  async leave_chatroom(intraId: number, chatroom_name: string) {
    await this.prisma_chat.remove_user_from_chatroom(intraId, chatroom_name).catch((e: Error) => {throw e;});
    const chatroom = await this.prisma_chat.get_chatroom_w_users(chatroom_name).catch((e: Error) => {throw e;});
    if (intraId === chatroom.ownerIntraId) {
      await this.prisma_chat.delete_chatroom(chatroom_name).catch((e: Error) => {throw e;});
      return 'You left as channel owner leaving the channel without leader, no captain, no one to guide this ship in these harsh times. Without captain, communication with the ship is impossible. She is probably foating somewhere out on the big digital ocean. Far out of the reach of web crawler, far out of the reach of any search engine. No future but the endless persistance of leaked data. R.I.P to the crewmembers. May their digital souls have ascended to the cloud.';
    }
    return 'You left the chatroom';
  }

  async join_chatroom(intraId: number, chatroom_name: string) {
    const isPrivate = await this.prisma_chat.is_private(chatroom_name).catch((e: Error) => {throw e;});
    if (isPrivate === true) {
      return 'Chatroom is private';
    }
    const isUserBanned = await this.prisma_chat.is_user_banned(intraId, chatroom_name).catch((e: Error) => {throw e;});
    if (isUserBanned === true) {
      throw new Error('You are banned from this chatroom');
    }
    return await this.prisma_chat.add_user_to_chatroom(intraId, chatroom_name).catch((e: Error) => {throw e;});
  }

  async toggle_access(intraId: number, chatroom_name: string) {
    const is_user_admin = await this.prisma_chat
      .is_user_admin(intraId, chatroom_name)
      .catch((e: Error) => {
        throw e;
      });
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    const isPrivate = await this.prisma_chat.is_private(chatroom_name).catch((e: Error) => {
      throw e;
    });
    if (isPrivate === true) {
      await this.prisma_chat.toggle_access(chatroom_name, false);
      return 'Made chatroom public';
    } else {
      await this.prisma_chat.toggle_access(chatroom_name, true);
      return 'Made chatroom private';
    }
  }

  async make_admin(ownerIntraId: number, chatroom_name: string, userIntraId: number) {
    const is_user_owner = await this.prisma_chat.is_user_owner(ownerIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_owner === false) {
      return 'You are not the owner';
    }
    const is_user_admin = await this.prisma_chat
    .is_user_admin(userIntraId, chatroom_name)
    .catch((e: Error) => {
      throw e;
    });
    if (is_user_admin === true) {
      return 'User is already an admin';
    }
    return await this.prisma_chat.make_admin(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
  }

  async change_owner(ownerIntraId: number, chatroom_name: string, newOwnerIntraId: number) {
    const is_user_owner = await this.prisma_chat.is_user_owner(ownerIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_owner === false) {
      return 'You are not the owner';
    }
    if (ownerIntraId === newOwnerIntraId) {
      return 'You are already the owner';
    }
    await this.prisma_chat.change_owner(newOwnerIntraId, chatroom_name).catch((e: Error) => {throw e;});
    return 'Changed owner';
  }

  async get_chatroom(intraId: number, chatroom_name: string): Promise<Chatroom> {
    const chatroom = await this.prisma_chat.get_chatroom_w_users(chatroom_name).catch((e: Error) => {throw e;});
    if (chatroom.private === true) {
      const isUserInChatroom = await this.prisma_chat.check_if_user_in_chatroom(intraId, chatroom_name).catch((e: Error) => {throw e;});
      if (isUserInChatroom === false) {
        throw new Error('Chatroom is private');
      }
    }
    if (chatroom.pw_hash !== null) {
      throw new Error('Chatroom is password protected');
    }
    const isUserBanned = await this.prisma_chat.is_user_banned(intraId, chatroom_name).catch((e: Error) => {throw e;});
    if (isUserBanned === true) {
      throw new Error('You are banned from this chatroom');
    }
    return chatroom;
  }

  async check_chatroom_pw(intraId: number, chatroom_name: string, password: string): Promise<Boolean> {
    const chatroom = await this.prisma_chat.get_chatroom_w_users(chatroom_name).catch((e: Error) => {throw e;});
    if (chatroom.private === true) {
      const isUserInChatroom = await this.prisma_chat.check_if_user_in_chatroom(intraId, chatroom_name).catch((e: Error) => {throw e;});
      if (isUserInChatroom === false) {
        throw new Error('Chatroom is private');
      }
    }
    if (chatroom.pw_hash === null) {
      return true;
    }
    const isPwValid = await argon.verify(chatroom.pw_hash, password);
    if (isPwValid === false) {
      throw new Error('Invalid password');
    }
    return true;
  }

  async set_password(ownerIntraId: number, chatroom_name: string, password: string) {
    const is_user_owner = await this.prisma_chat.is_user_owner(ownerIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_owner === false) {
      return 'You are not the owner';
    }
    await this.prisma_chat.set_password(chatroom_name, password).catch((e: Error) => {throw e;});
    return 'Password has been changed';
  }

  async ban_user(userIntraId: number, chatroom_name: string, bannedIntraId: number) {
    const is_user_admin = await this.prisma_chat.is_user_admin(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    const is_banned_admin = await this.prisma_chat
    .is_user_admin(bannedIntraId, chatroom_name)
    .catch((e: Error) => {
      throw e;
    });
    console.log('is_banned_admin: ', is_banned_admin);
    if (is_banned_admin === true) {
      return 'You cannot ban an admin';
    }
    return await this.prisma_chat.ban_user(bannedIntraId, chatroom_name).catch((e: Error) => {throw e;});
  }

  async connect_to_chatroom(intraId: number, chatroom_name: string) {
    const chatroom = await this.prisma_chat.get_chatroom_w_messages(chatroom_name).catch((e: Error) => {throw e;});
    if (chatroom.private === true) {
      const isUserInChatroom = await this.prisma_chat.check_if_user_in_chatroom(intraId, chatroom_name).catch((e: Error) => {throw e;});
      if (isUserInChatroom === false
          && await this.prisma_chat.is_private(chatroom_name) === true) {
        throw new Error('Chatroom is private');
      }
    }
    // if (chatroom.pw_hash !== null) {
    //   throw new Error('Chatroom is password protected');
    // }
    const isUserBanned = await this.prisma_chat.is_user_banned(intraId, chatroom_name).catch((e: Error) => {throw e;});
    if (isUserBanned === true) {
      throw new Error('You are banned from this chatroom');
    }
    const client = await this.gateway.get_socket_from_user(intraId);
    if (client === undefined) {
      throw new Error('You are not connected');
    }
    client.join(chatroom_name);
    return chatroom;
  }

  async add_message(destination: string, msg: string, userName: string) {
    return await this.prisma_chat.add_message(destination, msg, userName).catch((e: Error) => {throw e;});
  }

  async get_all_chatrooms(intraId: number): Promise<Chatroom[]> {
    return await this.prisma_chat.get_all_chatrooms(intraId).catch((e: Error) => {throw e;});
  }

  async mute_user(userIntraId: number, chatroom_name: string, mutedIntraId: number) {
    const is_user_admin = await this.prisma_chat.is_user_admin(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    const is_muted_admin = await this.prisma_chat
    .is_user_admin(mutedIntraId, chatroom_name)
    .catch((e: Error) => {
      throw e;
    });
    if (is_muted_admin === true) {
      return 'You cannot mute an admin';
    }
    const is_muted = await this.prisma_chat.is_user_muted(mutedIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_muted === true) {
      return 'User is already muted';
    }
    return await this.prisma_chat.mute_user(mutedIntraId, chatroom_name).catch((e: Error) => {throw e;});
  }

  async unmute_user(userIntraId: number, chatroom_name: string, mutedIntraId: number) {
    const is_user_admin = await this.prisma_chat.is_user_admin(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_admin === false) {
      return 'You are not an admin';
    }
    const is_muted = await this.prisma_chat.is_user_muted(mutedIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_muted === false) {
      return 'User isn\'t muted';
    }
    return await this.prisma_chat.unmute_user(mutedIntraId, chatroom_name).catch((e: Error) => {throw e;});
  }
}
