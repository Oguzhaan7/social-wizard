<script setup>
import { useWebSocketStore } from "~/stores/websocket";

const nuxtApp = useNuxtApp();

const websocketStore = useWebSocketStore();

if (nuxtApp.$ws) {
  const { status, data, send, open, close } = nuxtApp.$ws;
}

const currentMessage = ref(null);

watchEffect(() => {
  if (websocketStore.messageQueue.length > 0) {
    processNextMessage();
  }
  const nextMessage = websocketStore.dequeueMessage();
  if (nextMessage) {
    console.log(nextMessage);
    currentMessage.value = nextMessage;
    websocketStore.processMessage(nextMessage); // Mesajı işleme
  }
});

const getMessage = () => {
  console.log(websocketStore.messageQueue);
};
const processNextMessage = () => {
  const nextMessage = websocketStore.dequeueMessage();
  if (nextMessage) {
    currentMessage.value = nextMessage;
    websocketStore.processMessage(nextMessage); // Mesajı işleme
  }
};
</script>

<template>
  <NuxtLayout>
    <button @click="getMessage">mesajlar</button>
    <p v-if="currentMessage">Son Mesaj: {{ currentMessage.content }}</p>
    <NuxtPage />
  </NuxtLayout>
</template>
