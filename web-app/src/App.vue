<template>
  <loader :loading="loading">
    <router-view />
  </loader>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "ADD_NOTIFIER") {
        console.log("Will create the notifier to the body", state);
        const { text, title, timeout, color } = state.notifier;
        let div = document.createElement("div");
        const id = Date.now();
        div.setAttribute("id", id);
        div.classList.add(color);
        div.classList.add("alert alert-light custom-alert");
        div.innerHTML = `<p>${text + " " + title} </p>`;
        document.body.prepend(div);

        setTimeout(() => {
          const msg = document.getElementById(id.toString());

          if (msg) {
            msg.classList.remove("animate__backInRight");
            msg.classList.add("animate__backOutRight");
            setTimeout(() => {
              msg.remove();
            }, 100);
          }
        }, (timeout || 5000) - 100);
      }
    });
  },
  mounted() {
    this.checkIfUser();
  },
  methods: {
    async checkIfUser() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const resp = await this.$axios.get("me");
          this.$store.commit("user/SET_USER", resp.data);
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss"></style>
