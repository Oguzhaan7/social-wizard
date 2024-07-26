import fastifyPlugin from "fastify-plugin";
import amqplib from "amqplib";

async function rabbitMQPlugin(fastify: any, options: any) {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("tweet_likes");

  fastify.decorate("rabbitMQ", { channel });
}

export default fastifyPlugin(rabbitMQPlugin);
