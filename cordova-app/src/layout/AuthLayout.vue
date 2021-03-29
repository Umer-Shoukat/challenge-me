<template>
  <f7-page :name="pageTitle">
    <slot />
  </f7-page>
</template>

<script>
import { f7 } from "framework7-vue";

export default {
  name: "AuthLayout",
  props: {
    pageTitle: String,
  },
  created() {
    f7.toolbar.hide(".toolbar-bottom");
  },
  beforeDestroy() {
    f7.toolbar.show(".toolbar-bottom");
  },
};
</script>
