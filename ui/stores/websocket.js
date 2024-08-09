import { defineStore } from "pinia";

export const useWebSocketStore = defineStore("webSocket", () => {
  const messageQueue = ref([]);

  const enqueueMessage = (newMessage) => {
    messageQueue.value.push(newMessage);
  };

  const dequeueMessage = () => {
    return messageQueue.value.shift();
  };

  const handleTweetLike = (message) => {
    console.log("Tweet liked:", message);
    // İşlemleri burada yapın
  };

  const handleUserMessage = (message) => {
    console.log("User message:", message);
    // İşlemleri burada yapın
  };

  const handleTweetComment = (message) => {
    console.log("Tweet comment:", message);
    // İşlemleri burada yapın
  };

  const processMessage = (message) => {
    switch (message.type) {
      case "like":
        handleTweetLike(message);
        break;
      case "userMessage":
        handleUserMessage(message);
        break;
      case "tweetComment":
        handleTweetComment(message);
        break;
      default:
        console.warn("Unknown message type:", message.type);
    }
  };

  return {
    messageQueue,
    enqueueMessage,
    dequeueMessage,
    processMessage,
  };
});
