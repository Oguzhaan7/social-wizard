import fastify, { FastifyInstance } from "fastify";
import { config } from "./config/database";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import fastifyCors from "@fastify/cors";

import authPlugin from "./plugins/authenticate";
import rabbitmqPlugin from "./plugins/rabbitmq";
import webSocketPlugin from "./plugins/websocket";

import tweetLikeConsumer from "./consumers/tweet.like.consumer";

import authRoutes from "./routes/auth.route";
import tweetRoutes from "./routes/tweet.route";
import userRoutes from "./routes/user.route";
import hashtagRoutes from "./routes/hashtag.route";
import directMessageRoutes from "./routes/direct.message.route";
import notificationRoutes from "./routes/notification.route";
import listRoutes from "./routes/list.route";

configDotenv();

const server: FastifyInstance = fastify({ logger: true });

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Database connection
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Routes will be registered here

server.register(authPlugin);
server.register(rabbitmqPlugin);
server.register(webSocketPlugin);

server.register(authRoutes, { prefix: "/auth" });
server.register(tweetRoutes, { prefix: "/tweets" });
server.register(userRoutes, { prefix: "/users" });
server.register(hashtagRoutes, { prefix: "/hashTags" });
server.register(directMessageRoutes, { prefix: "/directMessages" });
server.register(notificationRoutes, { prefix: "/notifications" });
server.register(listRoutes, { prefix: "/lists" });

server.ready(async (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  await tweetLikeConsumer(server);
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 5000 });
    console.log(`Server is running on ${process.env.PORT || 5000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
