import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  if (userData.password) {
    userData.passwordHash = await bcrypt.hash(userData.password, 10);
    delete userData.password;
  }
  const user = new User(userData);
  return await user.save();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).select("-passwordHash");
};

export const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  if (updateData.password) {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password;
  }
  return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
    "-passwordHash"
  );
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await User.deleteOne({ _id: id });
  return result.deletedCount === 1;
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 20
): Promise<IUser[]> => {
  return await User.find()
    .select("-passwordHash")
    .skip((page - 1) * limit)
    .limit(limit);
};
