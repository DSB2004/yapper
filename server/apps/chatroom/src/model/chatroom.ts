import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
class LastMessage {
  @prop({ required: true }) public publicId!: string;
  @prop() public text?: string;
  @prop({ required: true }) public by!: string;
  @prop() public createdAt!: Date;

  @prop({ required: true })
  public previewText!: string;
}
@modelOptions({ schemaOptions: { timestamps: true } })
export class Chatroom {
  @prop() public name?: string;
  @prop() public icon?: string;
  @prop() public description?: string;
  @prop({ default: true }) public isActive!: boolean;
  @prop({ enum: ['PERSONAL', 'GROUP'], required: true }) public type!:
    | 'PERSONAL'
    | 'GROUP';
  @prop({ required: true, unique: true }) public publicId!: string;
  @prop({ required: true, unique: true }) public referenceId!: string;
  @prop({ type: () => [String], default: [] }) public participants!: string[];
  @prop({ required: true }) public createdBy!: string;
  @prop() public updatedBy?: string;
  public createdAt!: Date;
  public updatedAt?: Date;
  @prop({ type: () => LastMessage, default: undefined, _id: false })
  public lastMessage?: LastMessage;
}
export const ChatroomSchema = getModelForClass(Chatroom).schema;
