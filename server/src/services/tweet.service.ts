import Tweet, { ITweet } from "../models/Tweet";
import { Types } from "mongoose";
import { FastifyInstance } from "fastify";

export const createTweet = async (
  authorId: string,
  content: string
): Promise<ITweet> => {
  const tweet = new Tweet({
    author: new Types.ObjectId(authorId),
    content,
  });
  return await tweet.save();
};

export const getTweetById = async (id: string): Promise<ITweet | null> => {
  return await Tweet.findById(id).populate("author", "username displayName");
};

export const getAllTweets = async (
  page: number = 1,
  limit: number = 20
): Promise<ITweet[]> => {
  return await Tweet.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "username displayName");
};

export const updateTweet = async (
  id: string,
  content: string
): Promise<ITweet | null> => {
  return await Tweet.findByIdAndUpdate(id, { content }, { new: true });
};

export const deleteTweet = async (id: string): Promise<boolean> => {
  const result = await Tweet.deleteOne({ _id: id });
  return result.deletedCount === 1;
};

export const likeTweet = async (
  fastify: FastifyInstance,
  tweetId: string,
  userId: string
): Promise<ITweet | null> => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) return null;

  tweet.likes.push(userId);
  await tweet.save();

  console.log(fastify.rabbitMQ);

  fastify.rabbitMQ.channel.sendToQueue(
    "tweet_likes",
    Buffer.from(JSON.stringify({ tweetId }))
  );

  return tweet;
};
