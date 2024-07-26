import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IDirectMessage extends Document {
  sender: IUser["_id"];
  receiver: IUser["_id"];
  content: string;
  media: string[];
  isRead: boolean;
  createdAt: Date;
}

const DirectMessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: [{ type: String }],
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDirectMessage>(
  "DirectMessage",
  DirectMessageSchema
);
