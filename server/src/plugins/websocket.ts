import fastifyWebsocket from "@fastify/websocket";
import fastifyPlugin from "fastify-plugin";

async function websocketPlugin(fastify: any, options: any) {
  const connections = new Set();

  fastify.get("/ws", { websocket: true }, (connection: any, req: any) => {
    fastify.register(fastifyWebsocket);
    connections.add(connection);

    connection.socket.on("close", () => {
      connection.delete(connection);
    });

    connection.socket.on("message", (message: any) => {
      const data = JSON.parse(message);
      if (data.type === "like") {
        for (let conn of connections) {
          conn.socket.send(
            JSON.stringify({
              type: "like",
              tweetId: data.tweetId,
            })
          );
        }
      }
    });

    fastify.decorate("broadcastLike", (tweetId: any) => {
      for (let connection of connections) {
        connection.socket.send(
          JSON.stringify({
            type: "like",
            tweetId,
          })
        );
      }
    });
  });
}

export default fastifyPlugin(websocketPlugin);
