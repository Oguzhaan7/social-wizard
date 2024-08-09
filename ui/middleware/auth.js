import { useUserStore } from "../stores/userStore.js";
import { jwtDecode } from "jwt-decode";
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const userStore = useUserStore();
    const token = localStorage.getItem("token");

    if (token === null && to.path !== "/login") {
      abortNavigation();
      return navigateTo("/login");
    } else if (token !== null && to.path === "/login") {
      if (userStore.user === null) {
        userStore.user = jwtDecode(token).id;
        return navigateTo("/");
      }
    } else if (token !== null) {
      return;
    }
  }
});
