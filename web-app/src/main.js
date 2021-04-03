import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import service from "./axios/axios";
import notifier from "./plugins/notifier";

import "./scss/main.scss";
import "animate.css";

import Loader from "@/components/Loader";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";

const app = createApp(App)
  .use(store)
  .use(router);

app.use(service);
app.use(notifier);

app.component("loader", Loader);
app.component("AuthenticatedLayout", AuthenticatedLayout);

app.mount("#app");
