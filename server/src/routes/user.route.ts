import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../services/user.service";
import { IUser } from "../models/User";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userData = request.body as Partial<IUser>;
    const user = await createUser(userData);
    reply.code(201).send(user);
  });

  fastify.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await getUserById(id);
    if (!user) {
      reply.code(404).send({ message: "User not found" });
    } else {
      reply.send(user);
    }
  });

  fastify.put("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updateData = request.body as Partial<IUser>;
      const user = await updateUser(id, updateData);
      if (!user) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send(user);
      }
    },
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await deleteUser(id);
      if (result) {
        reply.code(204).send();
      } else {
        reply.code(404).send({ message: "User not found" });
      }
    },
  });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = request.query as { page?: string; limit?: string };
    const users = await getAllUsers(
      parseInt(page || "1"),
      parseInt(limit || "20")
    );
    reply.send(users);
  });
}
