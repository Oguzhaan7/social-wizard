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
  const ss = await useFetch("/tweets/66a493672dce4f7862d338a3", {
    baseURL: runtimeConfig.public.baseURL,
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTQ5MzBmMmRjZTRmNzg2MmQzMzhhMCIsImlhdCI6MTcyMjYyMDQ5MH0.upb-b4AGosFZ6ewDUXwiTm1BF-yCmGUPu_-5XRznBkQ",
    },
  });
  tweet.value = ss.data.value;
});

watchEffect(async () => {
  if (data.value) {
    messages.value.push(data.value);
    data.value = JSON.parse(data.value);
    console.log(data.value);
    if (data.value.type === "like") {
      tweet.value.likes?.push("66a365e5adffef772347d0de");
    } else {
      let likeIndex = tweet.value.likes.indexOf("66a365e5adffef772347d0de");
      tweet.value.likes.splice(likeIndex, 1);
    }
    data.value = "";
  }
});
</script>

<template>
  <div>
    <p class="p-6">{{ tweet?.likes?.length }}</p>
  </div>
</template>
