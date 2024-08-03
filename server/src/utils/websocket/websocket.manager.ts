import { FastifyInstance } from "fastify";

const webSocketPublisher = async (fastify: FastifyInstance) => {
  let connections = fastify.getConnections();

  console.log(connections);
};

export default webSocketPublisher;
