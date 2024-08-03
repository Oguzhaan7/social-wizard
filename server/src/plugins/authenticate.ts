import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyRegister } from "fastify";

export default fp(async (fastify) => {
  fastify.register<FastifyRegister>(jwt, {
    secret: process.env.SECRET_KEY || "super-secret-key-birakiyorum??",
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
