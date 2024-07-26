import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createList,
  getListById,
  updateList,
  deleteList,
  getAllLists,
} from "../services/list.service";
import { IList } from "../models/List";
import { Types } from "mongoose";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const listData = request.body as Partial<IList>;
      listData.owner = new Types.ObjectId(request.user.id);
      const list = await createList(listData);
      reply.code(201).send(list);
    },
  });

  fastify.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const list = await getListById(id);
    if (!list) {
      reply.code(404).send({ message: "List not found" });
    } else {
      reply.send(list);
    }
  });

  fastify.put("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updateData = request.body as Partial<IList>;
      const list = await updateList(id, updateData);
      if (!list) {
        reply.code(404).send({ message: "List not found" });
      } else {
        reply.send(list);
      }
    },
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await deleteList(id);
      if (result) {
        reply.code(204).send();
      } else {
        reply.code(404).send({ message: "List not found" });
      }
    },
  });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = request.query as { page?: string; limit?: string };
    const lists = await getAllLists(
      parseInt(page || "1"),
      parseInt(limit || "20")
    );
    reply.send(lists);
  });
}
