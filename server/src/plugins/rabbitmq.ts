import fastifyPlugin from "fastify-plugin";
import amqplib from "amqplib";

async function rabbitMQPlugin(fastify: any, options: any) {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  fastify.decorate("rabbitMQ", { channel, connection });
}

export default fastifyPlugin(rabbitMQPlugin);
