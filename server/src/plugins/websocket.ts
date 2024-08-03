import fastifyPlugin from "fastify-plugin";

async function websocketPlugin(fastify: any, options: any) {
  const connections = new Set();

  fastify.decorate("broadcastLike", (tweetId: any, action: any) => {
    for (let connection of connections) {
      connection.send(
        JSON.stringify({
          type: action,
          tweetId,
        })
      );
    }
  });

  fastify.decorate("getConnections", () => {
    return connections;
  });

  fastify.get("/", { websocket: true }, (connection, req) => {
    connections.add(connection);
    fastify.connection.on("close", () => {
      connections.delete(connection);
    });

    connection.on("message", (message: any) => {
      const data = JSON.parse(message);
      console.log(data);
      if (data.type === "like" || data.type === "unlike") {
        fastify.broadcastLike(data.tweetId, data.type);
      }
    });
  });
}

export default fastifyPlugin(websocketPlugin);
