import fastify, { FastifyInstance } from "fastify";
import { config } from "./config/database";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import fastifyCors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";

import authPlugin from "./plugins/authenticate";
import rabbitmqPlugin from "./plugins/rabbitmq";
import webSocketPlugin from "./plugins/websocket";

import producerManagerPlugin from "./utils/rabbitmq/producer.manager";
import ConsumerManager from "./utils/rabbitmq/consumer.manager";
import webSocketPublisher from "./utils/websocket/websocket.manager";

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

server.register(fastifyWebsocket);

server.register(webSocketPlugin);
server.register(authPlugin);
server.register(rabbitmqPlugin);
server.register(producerManagerPlugin);

server.register(authRoutes, { prefix: "/auth" });
server.register(tweetRoutes, { prefix: "/tweets" });
server.register(userRoutes, { prefix: "/users" });
server.register(hashtagRoutes, { prefix: "/hashTags" });
server.register(directMessageRoutes, { prefix: "/directMessages" });
server.register(notificationRoutes, { prefix: "/notifications" });
server.register(listRoutes, { prefix: "/lists" });

const start = async () => {
  try {
    await server.ready();
    await server.listen({ port: Number(process.env.PORT) || 5000 });
    console.log(`Server is running on ${process.env.PORT || 5000}`);
    await webSocketPublisher(server);

    const consumerManager = new ConsumerManager(server);

    await consumerManager.start();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
