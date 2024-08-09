import { FastifyInstance } from "fastify";

const webSocketPublisher = async (fastify: FastifyInstance) => {
  const connections = new Set();

  fastify.decorate("addConnection", (connection: any) => {
    connections.add(connection);
    console.log(connections.size);
  });

  fastify.decorate("deleteConnection", (connection: any) => {
    connections.delete(connection);
    console.log(connections.size);
  });

  fastify.decorate("getMessage", (connection: any) => {
    connection.on("message", (message: any) => {
      const data = JSON.parse(message);
      console.log(data);
      if (data.type === "like" || data.type === "unlike") {
        fastify.tweetLikeOrUnlike(data.tweetId, data.type);
      }
    });
  });

  fastify.decorate("tweetLikeOrUnlike", (tweetId: any, action: any) => {
    for (let connection of connections) {
      connection.send(
        JSON.stringify({
          type: action,
          tweetId,
        })
      );
    }
  });
};

export default webSocketPublisher;
