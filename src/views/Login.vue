<template>
  <div class="login">
    <LoginForm @logging-in="loggingIn()" />
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
  name: "Login",
  components: { LoginForm },
  methods: {
    loggingIn() {
      this.$emit("logging-in", true);
    },
  },
};
</script>
