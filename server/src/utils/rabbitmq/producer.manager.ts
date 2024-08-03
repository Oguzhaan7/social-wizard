import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

class ProducerManager {
  private channel: Channel;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.channel = fastify.rabbitMQ.channel;
  }

  registerProducer(
    queue: string,
    producerFn: (fastify: FastifyInstance, channel: Channel) => void
  ) {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }

    this.channel.assertQueue(queue);

    producerFn(this.fastify, this.channel);
  }

  async start() {
    this.registerProducer("tweet_likes", this.tweetLikesProducer.bind(this));
  }

  private tweetLikesProducer(fastify: FastifyInstance, channel: Channel) {
    fastify.decorate(
      "sendTweetLikeNotification",
      async (tweetId: string, action: string) => {
        const message = JSON.stringify({ tweetId, action });
        channel.sendToQueue("tweet_likes", Buffer.from(message));
      }
    );
  }
}

const producerManagerPlugin = async (fastify: FastifyInstance) => {
  const producerManager = new ProducerManager(fastify);
  await producerManager.start();
};

export default fastifyPlugin(producerManagerPlugin);
