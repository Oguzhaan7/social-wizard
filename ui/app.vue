<script setup>
import { useWebSocket } from "@vueuse/core";
const runtimeConfig = useRuntimeConfig();

const { status, data, send, open, close, ws } = useWebSocket(
  "ws://localhost:5000"
);

const messages = ref([]);

const socket = ref();

const tweet = ref();

onMounted(async () => {
  const ss = await useFetch("/tweets/66a3674dadffef772347d0e1", {
    baseURL: runtimeConfig.public.baseURL,
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTM2NWU1YWRmZmVmNzcyMzQ3ZDBkZSIsImlhdCI6MTcyMTk4NDc2NX0._Xza9U72lwFzfxvp7ujnLMO03Rd4a9ZTo3fapeGY7Pg",
    },
  });
  tweet.value = ss.data.value;
});

watchEffect(async () => {
  if (data.value) {
    messages.value.push(data.value);
    tweet.value.likes?.push("66a365e5adffef772347d0de");
    console.log("Message from server:", data.value);
    data.value = "";
  }
  // if (socket.value) {
  //   socket.value.addEventListener("message", function (event) {
  //     tweet.value.likes?.push("66a365e5adffef772347d0de");
  //     console.log("Message from server", event.data);
  //   });
  //   socket.value.addEventListener("close", function (event) {
  //     console.log("Disconnected from the WebSocket server");
  //   });
  //   socket.value.addEventListener("error", function (event) {
  //     console.error("WebSocket error", event);
  //   });
  // }
});
</script>

<template>
  <div>
    <p class="p-6">{{ tweet?.likes?.length }}</p>
  </div>
</template>
