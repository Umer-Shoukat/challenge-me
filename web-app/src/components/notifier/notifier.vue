<template>
  <div>
    notifiter will be here
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "notifier",
  computed: {
    ...mapState(["notifiers"]),
  },
  created() {},
};
</script>

<style lang="scss" scoped></style>
