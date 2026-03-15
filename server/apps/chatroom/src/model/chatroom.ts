import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
class Chatroom {
  @prop({ required: true })
  public name!: string;

  @prop()
  public icon?: string;

  @prop()
  public description?: string;

  @prop({ default: true })
  public isActive!: boolean;

  @prop({ enum: ['PERSONAL', 'GROUP'], required: true })
  public type!: 'PERSONAL' | 'GROUP';

  @prop({ required: true, unique: true })
  public publicId!: string;

  @prop({ type: () => [String], default: [] })
  public participants!: string[];

  @prop({ required: true })
  public createdBy!: string;

  @prop()
  public updatedBy?: string;

  public createdAt!: Date;
  public updatedAt?: Date;
}

export const ChatroomModel = getModelForClass(Chatroom);
