import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createDirectMessage,
  getDirectMessageById,
  updateDirectMessage,
  deleteDirectMessage,
  getConversation,
} from "../services/direct.message.service";
import { IDirectMessage } from "../models/DirectMessage";

import { Types } from "mongoose";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const messageData = request.body as Partial<IDirectMessage>;
      messageData.sender = new Types.ObjectId(request.user.id);
      const message = await createDirectMessage(messageData);
      reply.code(201).send(message);
    },
  });

  fastify.get("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const message = await getDirectMessageById(id);
      if (!message) {
        reply.code(404).send({ message: "Message not found" });
      } else {
        reply.send(message);
      }
    },
  });

  fastify.put("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updateData = request.body as Partial<IDirectMessage>;
      const message = await updateDirectMessage(id, updateData);
      if (!message) {
        reply.code(404).send({ message: "Message not found" });
      } else {
        reply.send(message);
      }
    },
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await deleteDirectMessage(id);
      if (result) {
        reply.code(204).send();
      } else {
        reply.code(404).send({ message: "Message not found" });
      }
    },
  });

  fastify.get("/conversation/:userId", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.params as { userId: string };
      const { page, limit } = request.query as {
        page?: string;
        limit?: string;
      };
      const messages = await getConversation(
        request.user.id,
        userId,
        parseInt(page || "1"),
        parseInt(limit || "20")
      );
      reply.send(messages);
    },
  });
}
