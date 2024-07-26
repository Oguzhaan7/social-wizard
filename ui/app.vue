<script setup>
const runtimeConfig = useRuntimeConfig();

const tweet = ref();

onMounted(async () => {
  const { data } = await useFetch("/tweets/66a3674dadffef772347d0e1", {
    baseURL: runtimeConfig.public.baseURL,
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTM2NWU1YWRmZmVmNzcyMzQ3ZDBkZSIsImlhdCI6MTcyMTk4NDc2NX0._Xza9U72lwFzfxvp7ujnLMO03Rd4a9ZTo3fapeGY7Pg",
    },
  });
  tweet.value = data.value;
});
</script>

<template>
  <div>
    <p class="p-6">{{ tweet?.likes?.length }}</p>
  </div>
</template>
