import { createStore } from "vuex";

import userModule from "./user";

export default createStore({
  state: {
    notifier: null,
  },
  mutations: {
    ADD_NOTIFIER(state, payload) {
      state.notifier = payload;
    },
  },
  actions: {},
  modules: { user: userModule },
  // strict: process.env.NODE_ENV !== "production",
});
