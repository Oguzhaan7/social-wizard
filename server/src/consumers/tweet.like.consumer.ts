import amqplib from "amqplib";

export default async function tweetLikesConsumer() {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("tweet_likes");

  channel.consume("tweet_likes", (message) => {
    if (message) {
      const { tweetId } = JSON.parse(message.content.toString());
      console.log(`Tweet with ID ${tweetId} was liked`);

      channel.ack(message);
    }
  });
}
