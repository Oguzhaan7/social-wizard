// src/routes/tweets.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createTweet,
  getTweetById,
  getAllTweets,
  updateTweet,
  deleteTweet,
  likeTweet,
} from "../services/tweet.service";
import { request } from "http";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { content } = request.body as { content: string };
      const authorId = request.user.id;
      const tweet = await createTweet(authorId, content);
      reply.code(201).send(tweet);
    },
  });

  fastify.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const tweet = await getTweetById(id);
    if (!tweet) {
      reply.code(404).send({ message: "Tweet not found" });
    } else {
      reply.send(tweet);
    }
  });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = request.query as { page?: string; limit?: string };
    const tweets = await getAllTweets(
      parseInt(page || "1"),
      parseInt(limit || "20")
    );
    reply.send(tweets);
  });

  fastify.put("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const { content } = request.body as { content: string };
      const tweet = await updateTweet(id, content);
      if (!tweet) {
        reply.code(404).send({ message: "Tweet not found" });
      } else {
        reply.send(tweet);
      }
    },
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await deleteTweet(id);
      if (result) {
        reply.code(204).send();
      } else {
        reply.code(404).send({ message: "Tweet not found" });
      }
    },
  });

  fastify.post("/:id/like", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const userId = request.user.id;
      const result = await likeTweet(fastify, id, userId);
      if (result) {
        reply.send({ success: true });
      } else {
        reply.code(404).send({ message: "Tweet not found" });
      }
    },
  });
}
