import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IHashtag } from "./Hashtag";

export interface ITweet extends Document {
  content: string;
  author: IUser["_id"];
  media: string[];
  likes: IUser["_id"][];
  retweets: IUser["_id"][];
  replies: ITweet["_id"][];
  quoteTweets: ITweet["_id"][];
  parentTweet: ITweet["_id"];
  hashtags: IHashtag["_id"][];
  mentions: IUser["_id"][];
  isRetweet: boolean;
  isQuoteTweet: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TweetSchema: Schema = new Schema(
  {
    content: { type: String, required: true, maxlength: 280 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    media: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweets: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    quoteTweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    parentTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    hashtags: [{ type: Schema.Types.ObjectId, ref: "Hashtag" }],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isRetweet: { type: Boolean, default: false },
    isQuoteTweet: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITweet>("Tweet", TweetSchema);
