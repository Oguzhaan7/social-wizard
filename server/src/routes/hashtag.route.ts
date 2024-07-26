import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createHashtag,
  getHashtagByName,
  updateHashtag,
  deleteHashtag,
  getAllHashtags,
} from "../services/hastag.service";
import { IHashtag } from "../models/Hashtag";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.body as { name: string };
    const hashtag = await createHashtag(name);
    reply.code(201).send(hashtag);
  });

  fastify.get(
    "/:name",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name } = request.params as { name: string };
      const hashtag = await getHashtagByName(name);
      if (!hashtag) {
        reply.code(404).send({ message: "Hashtag not found" });
      } else {
        reply.send(hashtag);
      }
    }
  );

  fastify.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<IHashtag>;
    const hashtag = await updateHashtag(id, updateData);
    if (!hashtag) {
      reply.code(404).send({ message: "Hashtag not found" });
    } else {
      reply.send(hashtag);
    }
  });

  fastify.delete(
    "/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await deleteHashtag(id);
      if (result) {
        reply.code(204).send();
      } else {
        reply.code(404).send({ message: "Hashtag not found" });
      }
    }
  );

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = request.query as { page?: string; limit?: string };
    const hashtags = await getAllHashtags(
      parseInt(page || "1"),
      parseInt(limit || "20")
    );
    reply.send(hashtags);
  });
}
