<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "login",
});

import { useUserStore } from "../stores/userStore.js";
import { jwtDecode } from "jwt-decode";

const userStore = useUserStore();
const runtimeConfig = useRuntimeConfig();

const email = ref();
const password = ref();

onMounted(async () => {
  let token = localStorage.getItem("token");
  if (token !== null) {
    if (userStore.user === null) {
      let user = jwtDecode(token);
      userStore.user = user.id;
    }
  }
});

const login = async () => {
  const token = await useFetch("/auth/login", {
    baseURL: runtimeConfig.public.baseURL,
    method: "post",
    body: {
      email: email.value,
      password: password.value,
    },
  });
  if (token.data.value.token) {
    localStorage.setItem("token", token.data.value.token);
    userStore.setUser(jwtDecode(token.data.value.token).id);
    navigateTo("/");
  }
};
</script>

<template>
  <div v-if="userStore.user === null">
    <div class="flex items-center justify-center h-screen">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 class="text-2xl font-bold text-center mb-6">Giriş Yap</h2>
          <form>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Eposta
              </label>
              <input
                v-model="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Eposta adresinizi girin"
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Şifre
              </label>
              <input
                v-model="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                @click="login"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Giriş Yap
              </button>
              <a
                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Şifrenizi mi unuttunuz?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
