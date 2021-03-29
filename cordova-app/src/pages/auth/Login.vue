<template>
  <AuthLayout pageTitle="Login">
    <h1 @click="f7router.back()">Hello world</h1>
  </AuthLayout>
</template>

<script>
import AuthLayout from "../../layout/AuthLayout";
export default {
  props: {
    f7route: Object,
    f7router: Object,
  },
  name: "Login",
  components: { AuthLayout },
};
</script>
