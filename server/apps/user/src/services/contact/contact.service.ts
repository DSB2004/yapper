import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { generateCuid } from '@yapper/utils';

import {
  BlockContactRequest,
  BlockContactResponse,
  CHATROOM_TYPE,
  CreateContactRequest,
  CreateContactResponse,
} from '@yapper/types';
import { ChatroomService } from 'src/rpc/chatroom/chatroom.service';

@Injectable()
export class ContactService {
  constructor(private readonly chatroom: ChatroomService) {}
  async createContact(
    payload: CreateContactRequest,
  ): Promise<CreateContactResponse> {
    try {
      const { authId, phone, firstName, lastName } = payload;

      const owner = await db.user.findUnique({
        where: { authId },
      });

      if (!owner) {
        return {
          status: 404,
          contactId: '',
          chatroomId: '',
          createdBy: '',
          success: false,
          message: 'Owner not found',
        };
      }
      const exist = await db.contact.findFirst({
        where: {
          userId: owner.id,
          phone,
        },
      });

      if (exist) {
        return {
          status: 400,
          contactId: '',
          success: false,
          message: 'Contact already exist',
          chatroomId: '',
          createdBy: '',
        };
      }

      const contactUser = await db.user.findUnique({
        where: { phone },
      });
      if (!contactUser)
        return {
          status: 400,
          contactId: '',
          success: false,
          message: "Contact user doesn't exist",
          chatroomId: '',
          createdBy: '',
        };

      const publicId = generateCuid('con');

      const chatroom = await this.chatroom.createChatroom({
        createdBy: owner.publicId,
        participants: [owner.publicId, contactUser.publicId],
        name: '',
        description: '',
        referenceId: publicId,
        type: CHATROOM_TYPE.PERSONAL,
      });
      const chatroomId = chatroom.chatroomId;

      const ownerContact = await db.contact.create({
        data: {
          publicId,
          userId: owner.id,

          name: `${firstName} ${lastName}`,
          phone,

          contactId: contactUser?.id,
          chatroomId,

          isBlocked: false,
        },
      });

      await db.contact.create({
        data: {
          publicId: generateCuid('con'),
          userId: contactUser.id,
          contactId: owner.id,
          name: `${owner.firstName} ${owner.lastName}`,
          phone: owner.phone,
          chatroomId,
          isBlocked: false,
        },
      });

      return {
        status: 200,
        contactId: ownerContact.publicId,
        success: true,
        message: 'Contact created',
        chatroomId,
        other: contactUser
          ? {
              avatar: contactUser.avatar ?? '',
              name: `${contactUser.firstName} ${contactUser.lastName}`,
              userId: contactUser.publicId,
            }
          : undefined,
        createdBy: owner.publicId,
      };
    } catch (err) {
      return {
        status: 500,
        chatroomId: '',
        success: false,
        message: 'Internal Server Error',
        contactId: '',
        createdBy: '',
      };
    }
  }

  async blockContact(
    payload: BlockContactRequest,
  ): Promise<BlockContactResponse> {
    try {
      const user = await db.user.findUnique({
        where: {
          authId: payload.authId,
        },
      });
      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
          chatroomId: payload.chatroomId,
        };
      }
      const contact = await db.contact.findFirst({
        where: {
          chatroomId: payload.chatroomId,
          userId: user.id,
        },
      });
      if (!contact)
        return {
          status: 404,
          success: false,
          message: 'Contact not found',
          chatroomId: payload.chatroomId,
        };
      await db.contact.update({
        where: {
          id: contact.id,
        },
        data: {
          isBlocked: !contact.isBlocked,
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Contact blocked',
        chatroomId: payload.chatroomId,
      };
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: 'Internal Server Error',
        chatroomId: payload.chatroomId,
      };
    }
  }
}
