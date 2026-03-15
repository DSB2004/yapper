import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { generateCuid } from '@yapper/utils';

import {
  BlockContactRequest,
  BlockContactResponse,
  CreateContactRequest,
  CreateContactResponse,
} from '@yapper/types';

@Injectable()
export class ContactService {
  async createContact(
    payload: CreateContactRequest,
  ): Promise<CreateContactResponse> {
    try {
      const { userId, phone, firstName, lastName } = payload;

      const owner = await db.user.findUnique({
        where: { publicId: userId },
      });

      if (!owner) {
        return {
          contactId: '',
          success: false,
          message: 'Owner not found',
        };
      }

      const contactUser = await db.user.findUnique({
        where: { phone, userId },
      });

      const chatroomId = generateCuid('cht');

      const ownerContact = await db.contact.create({
        data: {
          publicId: generateCuid('con'),
          userId: owner.id,

          name: `${firstName} ${lastName}`,
          phone,

          contactId: contactUser?.id,
          chatroomId,

          isBlocked: false,
        },
      });

      if (contactUser) {
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
      }

      return {
        contactId: ownerContact.publicId,
        success: true,
        message: 'Contact created',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Internal Server Error',
        contactId: '',
      };
    }
  }

  async blockContact(
    payload: BlockContactRequest,
  ): Promise<BlockContactResponse> {
    try {
      const contact = await db.contact.findUnique({
        where: {
          publicId: payload.contactId,
        },
      });
      if (!contact)
        return {
          success: false,
          message: 'Contact not found',
          contactId: payload.contactId,
        };
      await db.contact.update({
        where: {
          publicId: payload.contactId,
        },
        data: {
          isBlocked: !contact.isBlocked,
        },
      });

      return {
        success: true,
        message: 'Contact blocked',
        contactId: payload.contactId,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Internal Server Error',
        contactId: payload.contactId,
      };
    }
  }
}
