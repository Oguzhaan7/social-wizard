import Notification, { INotification } from "../models/Notification";

export const createNotification = async (
  notificationData: Partial<INotification>
): Promise<INotification> => {
  const notification = new Notification(notificationData);
  return await notification.save();
};

export const getNotificationsForUser = async (
  userId: string
): Promise<INotification[]> => {
  return await Notification.find({ receiver: userId }).sort({ createdAt: -1 });
};

export const markNotificationAsRead = async (
  id: string
): Promise<INotification | null> => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
};

export const deleteNotification = async (id: string): Promise<boolean> => {
  const result = await Notification.deleteOne({ _id: id });
  return result.deletedCount === 1;
};
