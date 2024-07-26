import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IList extends Document {
  name: string;
  description: string;
  owner: IUser["_id"];
  members: IUser["_id"][];
  followers: IUser["_id"][];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IList>("List", ListSchema);
