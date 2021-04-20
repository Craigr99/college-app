<template>
  <div class="login">
    <LoginForm @login="loggingIn()" />
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
  name: "Login",
  components: { LoginForm },
  methods: {
    loggingIn() {
      // Emit event to App.vue
      this.$emit("login");
    },
  },
};
</script>
