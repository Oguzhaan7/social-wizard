// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@formkit/auto-animate/nuxt",
    "@pinia/nuxt",
    "@pinia/nuxt",
  ],
  plugins: [
    {
      src: "./plugins/websocket.js",
      mode: "client",
    },
  ],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "http://localhost:5000",
    },
  },
});
