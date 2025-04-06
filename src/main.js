import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vueDebounce from "vue-debounce";
import { createI18n } from "vue-i18n";
import pt_BR from "@/i18n/locales/pt_BR.json";
import en_US from "@/i18n/locales/en_US.json";
import es from "@/i18n/locales/es.json";

const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  messages: {
    en_US,
    es,
    pt_BR,
  },
  legacy: false,
  globalInjection: true,
});

const app = createApp(App);

app.use(i18n);
app.use(router);
app.directive("debounce", vueDebounce());

app.mount("#app");
