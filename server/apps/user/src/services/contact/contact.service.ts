import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { generateCuid } from '@yapper/utils';

import {
  BLOCK_STATUS_UPDATE,
  BlockContactRequest,
  BlockContactResponse,
  CHATROOM_TYPE,
  CheckBlockRequest,
  CheckBlockResponse,
  CreateContactRequest,
  CreateContactResponse,
  KAFKA_EVENTS,
} from '@yapper/types';
import { ChatroomService } from 'src/rpc/chatroom/chatroom.service';
import { GatewayService } from 'src/rpc/gateway/gateway.service';
import { KafkaProducer } from 'src/kafka/kafka.producer';

@Injectable()
export class ContactService {
  constructor(
    private readonly chatroom: ChatroomService,
    private readonly gateway: GatewayService,
    private readonly producer: KafkaProducer,
  ) {}
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
      const contactUser = await db.user.findUnique({
        where: {
          publicId: payload.contactUserId,
        },
      });
      if (!user || !contactUser) {
        return {
          status: 404,
          success: false,
          message: 'User or contactUser not found',
        };
      }
      const contact = await db.contact.findFirst({
        where: {
          contactId: contactUser.id,
          userId: user.id,
        },
      });
      if (!contact)
        return {
          status: 404,
          success: false,
          message: 'Contact not found',
        };
      const res = await db.contact.update({
        where: {
          id: contact.id,
        },
        data: {
          isBlocked: !contact.isBlocked,
        },
      });

      const kafkaPayload: BLOCK_STATUS_UPDATE = {
        contactId: contactUser.publicId,
        userId: user.publicId,
        chatroomId: res.chatroomId,
      };
      if (res.isBlocked) {
        await this.gateway.removeUsersFromChatroom({
          userIds: [user.publicId],
          chatroom: res.chatroomId,
        });
        await this.producer.produce(KAFKA_EVENTS.CONTACT.BLOCK, [kafkaPayload]);
      } else {
        await this.gateway.addUsersToChatroom({
          chatroom: res.chatroomId,
          userIds: [user.publicId],
        });
        await this.producer.produce(KAFKA_EVENTS.CONTACT.UNBLOCK, [
          kafkaPayload,
        ]);
      }

      return {
        status: 200,
        success: true,
        message: 'Contact blocked',
      };
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async checkBlockStatus(
    payload: CheckBlockRequest,
  ): Promise<CheckBlockResponse> {
    try {
      const user = await db.user.findUnique({
        where: {
          publicId: payload.userId,
        },
      });
      const contactUser = await db.user.findUnique({
        where: {
          publicId: payload.contactId,
        },
      });
      if (!user || !contactUser) {
        return {
          isBlocked: false,
          status: 404,
          success: false,
          message: 'User or contactUser not found',
        };
      }
      const contact = await db.contact.findFirst({
        where: {
          contactId: contactUser.id,
          userId: user.id,
        },
      });
      if (!contact)
        return {
          isBlocked: false,
          status: 404,
          success: false,
          message: 'Contact not found',
        };

      return {
        isBlocked: contact.isBlocked,
        status: 200,
        success: true,
        message: 'Contact blocked status returned',
      };
    } catch (err) {
      return {
        isBlocked: false,
        status: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
}
