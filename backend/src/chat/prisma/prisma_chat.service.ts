import { Injectable, NotFoundException } from '@nestjs/common';
import { Chatroom, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as argon from 'argon2';
import { Socket } from 'socket.io';

@Injectable()
export class PrismaChatService {
  constructor(private prisma: PrismaService) {}

  async create_chatroom(intraId: number, name: string) {
    const all_users = await this.prisma.user.findMany({});
    if (!(await this.check_if_chatroom_exists(name))) {
      return await this.prisma.chatroom.create({
        data: {
          name: name,
          ownerIntraId: intraId,
          admins: {
            connect: {
              intraId: intraId,
            },
          },
          users:{
               connect: all_users.map((user) => {
                return {intraId: user.intraId};
             }),
          }
        },
      });
    }
    throw new Error('Chatroom already exists');
  }

  async create_dm_chatroom(intraId: number, intraId2: number, name: string) {
    if (!(await this.check_if_chatroom_exists(name))) {
      return await this.prisma.chatroom.create({
        data: {
          name: name,
          ownerIntraId: intraId,
          admins: {
            connect: [
              {intraId: intraId},
              {intraId: intraId2}
            ],
          },
          isDm: true,
          users:  {
            connect: [
              {intraId: intraId},
              {intraId: intraId2}
            ],
          }
        },
      });
    }
    throw new Error('Chatroom already exists');
  }

  async get_chatroom_w_messages(name: string): Promise<Chatroom> {
    return await this.prisma.chatroom
      .findUniqueOrThrow({
        where: {
          name: name,
        },
        include: {
          messages: true,
        }
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaUserService.findChatroom error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new NotFoundException();
      });
  }

  async delete_chatroom(name: string) {
    return await this.prisma.chatroom
      .delete({
        where: {
          name: name,
        },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        return 'Chatroom does not exist';
      });
  }

  async add_user_to_chatroom(intraId: number, chatroom_name: string) {
    if (!(await this.check_if_user_exists(intraId))) {
      return 'User does not exist';
    }
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      return 'Chatroom does not exist';
    }
    if (await this.check_if_user_in_chatroom(intraId, chatroom_name)) {
      return 'User is already in chatroom';
    }
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        users: {
          connect: {
            intraId: intraId,
          },
        },
      },
    });
  }

  async change_owner(newOwnerIntraId: number, chatroom_name: string) {
    if (!(await this.check_if_user_exists(newOwnerIntraId))) {
      return 'User does not exist';
    }
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      return 'Chatroom does not exist';
    }
    return await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        ownerIntraId: newOwnerIntraId,
      },
    });
  }

  async remove_user_from_chatroom(intraId: number, chatroom_name: string) {
    if (!(await this.check_if_user_exists(intraId))) {
      throw new Error('User does not exist');
    }
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_in_chatroom(intraId, chatroom_name))) {
      throw new Error('User is not in chatroom');
    }
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        users: {
          disconnect: {
            intraId: intraId,
          },
        },
      },
    });
    if (await this.is_user_admin(intraId, chatroom_name)) {
      await this.prisma.chatroom.update({
        where: {
          name: chatroom_name,
        },
        data: {
          admins: {
            disconnect: {
              intraId: intraId,
            },
          },
        },
      });
    }
    return 'User removed from chatroom';
  }

  async ban_user(bannedIntraId: number, chatroom_name: string) {
    if (!(await this.check_if_user_exists(bannedIntraId))) {
      throw new Error('User does not exist');
    }
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_in_chatroom(bannedIntraId, chatroom_name))) {
      throw new Error('User is not in chatroom');
    }
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        users: {
          disconnect: {
            intraId: bannedIntraId,
          },
        },
      },
    });
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
          bannedUsers: {
            connect: {
              intraId: bannedIntraId,
            },
        }
      },
    });
    return 'User ' + bannedIntraId + ' from chatroom';
  }

  async check_if_user_exists(intraId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        intraId: intraId,
      },
    });
    return !!user;
  }

  async check_if_chatroom_exists(name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: name,
      },
    });
    return !!chatroom;
  }

  async check_if_user_in_chatroom(intraId: number, chatroom_name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
      include: {
        users: true,
        admins: true,
      },
    });
    if (!chatroom) {
      return false;
    }
    return (
      chatroom.users.some((user) => user.intraId === intraId) ||
      chatroom.admins.some((admin) => admin.intraId === intraId)
    );
  }

  async get_chatroom_w_users(chatroom_name: string): Promise<Chatroom> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
      include: {
        users: true,
        admins: true,
      },
    });
    if (!chatroom) {
      throw new Error('Chatroom does not exist');
    }
    return chatroom;
  }

  async make_admin(userIntraId: number, chatroom_name: string) {
   const is_user_admin = await this.is_user_admin(userIntraId, chatroom_name).catch((e: Error) => {throw e;});
    if (is_user_admin === true) {
      return 'User already is an admin';
    }
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        admins: {
          connect: {
            intraId: userIntraId,
          },
        },
      },
    });
    return 'User is now an admin';
  }

  async is_private(name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom
      .findUniqueOrThrow({
        where: {
          name: name,
        },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        throw new Error('Chatroom does not exist');
      });
    return chatroom.private;
  }

  async toggle_access(name: string, isPrivate: boolean) {
    return await this.prisma.chatroom.update({
      where: {
        name: name,
      },
      data: {
        private: isPrivate,
      },
    });
  }

  async is_user_admin(intraId: number, chatroom_name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
      include: {
        admins: true,
      },
    });
    if (!chatroom) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_exists(intraId))) {
      throw new Error('User does not exist');
    }
    return chatroom.admins.some((admin) => admin.intraId === intraId);
  }

  async is_user_banned(intraId: number, chatroom_name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
      include: {
        bannedUsers: true,
      },
    });
    if (!chatroom) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_exists(intraId))) {
      throw new Error('User does not exist');
    }
    return chatroom.bannedUsers.some((user) => user.intraId === intraId);
  }

  async is_user_owner(intraId: number, chatroom_name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
    });
    if (!(await this.check_if_user_exists(intraId))) {
      throw new Error('User does not exist');
    }
    if (!chatroom) {
      throw new Error('Chatroom does not exist');
    }
    return chatroom.ownerIntraId === intraId;
  }

  async set_password(chatroom_name: string, password: string) {
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      throw new Error('Chatroom does not exist');
    }
    if (!password) {
      await this.prisma.chatroom.update({
        where: {
          name: chatroom_name,
        },
        data: {
          pw_hash: password,
        },
      });
    }
    else {
      const hash_ = await argon.hash(password);
      await this.prisma.chatroom.update({
        where: {
          name: chatroom_name,
        },
        data: {
          pw_hash: hash_,
        },
      });
    }
    return 'Password set';
  }

  async add_socket_to_user(intraId: number, client: Socket) {
    const user = await this.prisma.user.findUnique({
      where: {
        intraId: intraId,
      },
    });
    if (!user) {
      throw new Error('User does not exist');
    }
    const clientObj = client.handshake as unknown as Prisma.JsonObject
    await this.prisma.user.update({
      where: {
        intraId: intraId,
      },
      data: {
        socket: clientObj,
      },
    });
  }

  async get_all_chatrooms(intraId: number): Promise<Chatroom[]> {
    return await this.prisma.chatroom.findMany({
      where: {
        users: {
          some: {
              intraId: intraId
          },
        },
      },
      include: {
        users: true, admins: true, bannedUsers: true, messages: true
      }
    });  
  }

  async add_message(destination: string, msg: string, userName: string) {
    const message = await this.prisma.message.create({
      data: {
        chatroom: {
          connect: {
            name: destination,
          },
        },
        content: msg,
        senderName: userName,
      },
    }).catch((e: Error) => {throw e;});
  }

  async mute_user(mutedIntraId: number, chatroom_name: string) {
    if (!(await this.check_if_user_exists(mutedIntraId))) {
      throw new Error('User does not exist');
    }
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_in_chatroom(mutedIntraId, chatroom_name))) {
      throw new Error('User is not in chatroom');
    }
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        mutedIds: {
          push: mutedIntraId
        }
      },
    });
    return 'muted ' + mutedIntraId + ' in chatroom' + chatroom_name;
  }

  async unmute_user(mutedIntraId: number, chatroom_name: string) {
    if (!(await this.check_if_user_exists(mutedIntraId))) {
      throw new Error('User does not exist');
    }
    if (!(await this.check_if_chatroom_exists(chatroom_name))) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_in_chatroom(mutedIntraId, chatroom_name))) {
      throw new Error('User is not in chatroom');
    }
    const { mutedIds } = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
      select: {
        mutedIds: true,
      },
    });
    await this.prisma.chatroom.update({
      where: {
        name: chatroom_name,
      },
      data: {
        mutedIds: {
          set: mutedIds.filter((intraId) => intraId !== mutedIntraId)
        }
      },
    });
    return 'unmuted ' + mutedIntraId + ' in chatroom' + chatroom_name;
  }

  async is_user_muted(intraId: number, chatroom_name: string): Promise<boolean> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        name: chatroom_name,
      },
    });
    if (!chatroom) {
      throw new Error('Chatroom does not exist');
    }
    if (!(await this.check_if_user_exists(intraId))) {
      throw new Error('User does not exist');
    }
    if (chatroom.mutedIds.includes(intraId)) {
      return true;
    }
    return false;
  }
}
