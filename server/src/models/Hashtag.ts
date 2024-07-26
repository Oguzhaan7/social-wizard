import mongoose, { Schema, Document } from "mongoose";
import { ITweet } from "./Tweet";

export interface IHashtag extends Document {
  name: string;
  tweets: ITweet["_id"][];
  trendingScore: number;
}

const HashtagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  trendingScore: { type: Number, default: 0 },
});

export default mongoose.model<IHashtag>("Hashtag", HashtagSchema);
