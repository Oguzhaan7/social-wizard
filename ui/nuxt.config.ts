// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@formkit/auto-animate/nuxt",
    "@pinia/nuxt",
    "nuxt-socket-io",
  ],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "http://localhost:5000",
    },
  },
  io: {
    sockets: [
      {
        name: "main",
        url: "http://localhost:3000",
      },
    ],
  },
});
