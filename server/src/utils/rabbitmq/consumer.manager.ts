import { FastifyInstance } from "fastify";
import { Channel } from "amqplib";

class ConsumerManager {
  private channel: Channel;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.channel = fastify.rabbitMQ.channel;
  }

  registerConsumer(
    queue: string,
    consumerFn: (fastify: FastifyInstance, channel: Channel) => void
  ) {
    consumerFn(this.fastify, this.channel);
  }

  async start() {
    this.registerConsumer("tweet_likes", this.tweetLikesConsumer);
    // this.registerConsumer("direct_messages", this.directMessagesConsumer);
  }

  private tweetLikesConsumer(fastify: FastifyInstance, channel: Channel) {
    channel.consume("tweet_likes", (message) => {
      if (message) {
        const { tweetId, action } = JSON.parse(message.content.toString());
        fastify.broadcastLike(tweetId, action);
        console.log(`Tweet ID: ${tweetId}, Action: ${action}`);
        channel.ack(message);
      }
    });
  }

  private directMessagesConsumer(channel: Channel) {
    channel.consume("direct_messages", (message) => {
      if (message) {
        const { receiverId, content } = JSON.parse(message.content.toString());
        console.log(`Receiver ID: ${receiverId}, Message: ${content}`);
        channel.ack(message);
      }
    });
  }
}

export default ConsumerManager;
