import mongoose, { Schema, Document } from "mongoose";
import { ITweet } from "./Tweet";

export interface IPollOption extends Document {
  text: string;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  expiresAt: Date;
  tweet: ITweet["_id"];
}

const PollOptionSchema: Schema = new Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const PollSchema: Schema = new Schema({
  question: { type: String, required: true },
  options: [PollOptionSchema],
  expiresAt: { type: Date, required: true },
  tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
});

export default mongoose.model<IPoll>("Poll", PollSchema);
