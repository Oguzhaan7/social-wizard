import fastifyPlugin from "fastify-plugin";

async function websocketPlugin(fastify: any, options: any) {
  const connections = new Set();

  fastify.decorate("broadcastLike", (tweetId: any) => {
    for (let connection of connections) {
      connection.send(
        JSON.stringify({
          type: "like",
          tweetId,
        })
      );
    }
  });

  fastify.get("/", { websocket: true }, (connection, req) => {
    connections.add(connection);

    connection.on("close", () => {
      connections.delete(connection);
    });

    connection.on("message", (message: any) => {
      const data = JSON.parse(message);
      if (data.type === "like") {
        fastify.broadcastLike(data.tweetId);
      }
    });
  });
}

export default fastifyPlugin(websocketPlugin);
