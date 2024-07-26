import amqplib from "amqplib";
import { FastifyInstance } from "fastify";

export default async function tweetLikesConsumer(fastify: FastifyInstance) {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("tweet_likes");

  channel.consume("tweet_likes", (message) => {
    if (message) {
      const { tweetId } = JSON.parse(message.content.toString());
      console.log(`Tweet with ID ${tweetId} was liked`);
      fastify.broadcastLike(tweetId);
      channel.ack(message);
    }
  });
}
