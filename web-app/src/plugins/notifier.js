export default {
  install: (app) => {
    const store = app.config.globalProperties.$store;

    const notifier = {
      showSuccess(text = "Enter Text", title = "", timeout = 5000) {
        store.commit("ADD_NOTIFIER", {
          text,
          title,
          timeout,
          color: "success",
        });
      },
      showWarning(text = "Enter Text", title = "", timeout = 5000) {
        store.commit("ADD_NOTIFIER", {
          text,
          title,
          timeout,
          color: "warning",
        });
      },
      showDanger(text = "Enter Text", title = "", timeout = 5000) {
        store.commit("ADD_NOTIFIER", {
          text,
          title,
          timeout,
          color: "danger",
        });
      },
      showCustom(
        text = "Enter Text",
        title = "",
        timeout = 5000,
        color = "#333"
      ) {
        store.commit("ADD_NOTIFIER", {
          text,
          title,
          timeout,
          color,
        });
      },
    };

    app.config.globalProperties.$notifier = notifier;
  },
};
