import { FastifyInstance } from "fastify";
import { registerUser, loginUser } from "../services/auth.service";

export default async function (fastify: FastifyInstance) {
  fastify.post("/register", async (request, reply) => {
    const { username, email, password, displayName } = request.body as any;
    const user = await registerUser(username, email, password, displayName);
    reply.code(201).send(user);
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as any;
    const user = await loginUser(email, password);
    const token = fastify.jwt.sign({ id: user._id });
    reply.send({ token });
  });
}
