import List, { IList } from "../models/List";
import { Types } from "mongoose";

export const createList = async (listData: Partial<IList>): Promise<IList> => {
  const list = new List(listData);
  return await list.save();
};

export const getListById = async (id: string): Promise<IList | null> => {
  return await List.findById(id).populate("owner", "username displayName");
};

export const updateList = async (
  id: string,
  updateData: Partial<IList>
): Promise<IList | null> => {
  return await List.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteList = async (id: string): Promise<boolean> => {
  const result = await List.deleteOne({ _id: id });
  return result.deletedCount === 1;
};

export const getAllLists = async (
  page: number = 1,
  limit: number = 20
): Promise<IList[]> => {
  return await List.find()
    .populate("owner", "username displayName")
    .skip((page - 1) * limit)
    .limit(limit);
};
