import fastifyPlugin from "fastify-plugin";

async function websocketPlugin(fastify: any, options: any) {
  fastify.get("/", { websocket: true }, (connection: any, req: any) => {
    fastify.addConnection(connection);

    connection.on("close", () => {
      fastify.deleteConnection(connection);
    });

    fastify.getMessage(connection);
  });
}

export default fastifyPlugin(websocketPlugin);
