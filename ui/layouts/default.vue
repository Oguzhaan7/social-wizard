<script setup>
import { useUserStore } from "../stores/userStore.js";
import { jwtDecode } from "jwt-decode";

const userStore = useUserStore();
if (import.meta.client && userStore.user === null) {
  userStore.user = jwtDecode(localStorage.getItem("token")).id;
}

const logout = () => {
  userStore.user = null;
  localStorage.removeItem("token");
};
</script>

<template>
  <div class="flex flex-col bg-gray-100 min-h-screen">
    <div
      class="flex w-full justify-end items-center h-24 bg-zinc-700 text-slate-200"
    >
      <div class="px-24" v-if="userStore.user">
        {{ userStore.user }} <button @click="logout">Çıkış yap</button>
      </div>
      <div class="px-24" v-else>
        <NuxtLink to="/login">Giriş Yap</NuxtLink>
      </div>
    </div>
    <div class="px-24">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
