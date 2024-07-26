import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { ITweet } from "./Tweet";

export interface INotification extends Document {
  type: "like" | "retweet" | "mention" | "follow" | "reply";
  sender: IUser["_id"];
  receiver: IUser["_id"];
  relatedTweet: ITweet["_id"];
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["like", "retweet", "mention", "follow", "reply"],
    required: true,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  relatedTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
