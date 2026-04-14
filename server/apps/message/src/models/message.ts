import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';

// ─── Nested Classes ──────────────────────────────────────────────────────────

class MessageAttachment {
  @prop({ required: true }) public url!: string;
  @prop({ required: true }) public filename!: string;
  @prop({ required: true }) public filesize!: number;
}

class MessageReaction {
  @prop({ required: true }) public userId!: string;
  @prop({ required: true }) public reaction!: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true, unique: true })
  public publicId!: string;

  @prop({ required: true })
  public chatroomId!: string;

  @prop()
  public text?: string;

  @prop({ default: false })
  public isPinned!: boolean;

  @prop({ default: false })
  public isStarred!: boolean;

  @prop({ default: false })
  public isUpdated!: boolean;

  @prop({ enum: ['INFO', 'GENERAL'], required: true })
  public type!: 'INFO' | 'GENERAL';

  @prop({ type: () => [String], default: [] })
  public seen!: string[];

  @prop({ type: () => [String], default: [] })
  public received!: string[];

  @prop({ type: () => [MessageAttachment], default: [], _id: false })
  public attachments!: MessageAttachment[];

  @prop({ type: () => [MessageReaction], default: [], _id: false })
  public reactions!: MessageReaction[];

  @prop({ required: true })
  public by!: string;

  public createdAt!: Date;
  public updatedAt?: Date;
}

export const MessageSchema = getModelForClass(Message).schema;
