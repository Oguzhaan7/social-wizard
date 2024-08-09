<script setup>
const config = useRuntimeConfig();
const tweets = ref([]);
const token = ref();

onMounted(async () => {
  await nextTick();
  token.value = localStorage.getItem("token");
  await getTweets(1, 10);
});

const getTweets = async (page, limit) => {
  const { data, status } = await useFetch("/tweets", {
    method: "get",
    baseURL: config.public.baseURL,
    headers: {
      authorization: `Bearer ${token.value}`,
    },
    query: {
      page: page,
      limit: limit,
    },
  });

  if (status.value === "success") {
    tweets.value = data.value;
  }
};
</script>
<template>
  <div>
    <ul>
      <li v-for="tweet in tweets">{{ tweet.likes.length }}</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
