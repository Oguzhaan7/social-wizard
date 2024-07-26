import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notification.service";
import { INotification } from "../models/Notification";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const notificationData = request.body as Partial<INotification>;
      const notification = await createNotification(notificationData);
      reply.code(201).send(notification);
    },
  });

  fastify.get("/", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user.id;
      const notifications = await getNotificationsForUser(userId);
      reply.send(notifications);
    },
  });

  fastify.put("/:id/read", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const notification = await markNotificationAsRead(id);
      if (!notification) {
        reply.code(404).send({ message: "Notification not found" });
      } else {
        reply.send(notification);
      }
    },
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await deleteNotification(id);
      if (result) {
        reply.code(204).send();
      } else {
        reply.code(404).send({ message: "Notification not found" });
      }
    },
  });
}
