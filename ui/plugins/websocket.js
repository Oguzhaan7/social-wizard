import { useWebSocket } from "@vueuse/core";
import { defineNuxtPlugin } from "#app";
import { useWebSocketStore } from "@/stores/websocket.js";

export default defineNuxtPlugin((nuxtApp) => {
  const websocketStore = useWebSocketStore();

  const { status, data, send, open, close } = useWebSocket(
    "ws://localhost:5000",
    {
      autoReconnect: true,
      onConnected: () => console.log("WebSocket connected"),
      onDisconnected: () => console.log("WebSocket disconnected"),
      onError: (e) => console.error("WebSocket error:", e),
    }
  );

  watchEffect(() => {
    if (data.value) {
      const messageData = JSON.parse(data.value);
      websocketStore.enqueueMessage(messageData);
    }
  });

  nuxtApp.provide("ws", { status, data, send, open, close });
});
