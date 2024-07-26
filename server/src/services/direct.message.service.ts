import DirectMessage, { IDirectMessage } from "../models/DirectMessage";

export const createDirectMessage = async (
  messageData: Partial<IDirectMessage>
): Promise<IDirectMessage> => {
  const message = new DirectMessage(messageData);
  return await message.save();
};

export const getDirectMessageById = async (
  id: string
): Promise<IDirectMessage | null> => {
  return await DirectMessage.findById(id).populate(
    "sender receiver",
    "username displayName"
  );
};

export const updateDirectMessage = async (
  id: string,
  updateData: Partial<IDirectMessage>
): Promise<IDirectMessage | null> => {
  return await DirectMessage.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteDirectMessage = async (id: string): Promise<boolean> => {
  const result = await DirectMessage.deleteOne({ _id: id });
  return result.deletedCount === 1;
};

export const getConversation = async (
  user1Id: string,
  user2Id: string,
  page: number = 1,
  limit: number = 20
): Promise<IDirectMessage[]> => {
  return await DirectMessage.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id },
    ],
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender receiver", "username displayName");
};
