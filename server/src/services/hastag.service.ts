import Hashtag, { IHashtag } from "../models/Hashtag";

export const createHashtag = async (name: string): Promise<IHashtag> => {
  const hashtag = new Hashtag({ name });
  return await hashtag.save();
};

export const getHashtagByName = async (
  name: string
): Promise<IHashtag | null> => {
  return await Hashtag.findOne({ name });
};

export const updateHashtag = async (
  id: string,
  updateData: Partial<IHashtag>
): Promise<IHashtag | null> => {
  return await Hashtag.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteHashtag = async (id: string): Promise<boolean> => {
  const result = await Hashtag.deleteOne({ _id: id });
  return result.deletedCount === 1;
};

export const getAllHashtags = async (
  page: number = 1,
  limit: number = 20
): Promise<IHashtag[]> => {
  return await Hashtag.find()
    .skip((page - 1) * limit)
    .limit(limit);
};
