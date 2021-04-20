<template>
  <div class="register">
    <RegisterForm @register="registeringUser()" />
  </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm.vue";

export default {
  name: "Login",
  components: { RegisterForm },
  methods: {
    registeringUser() {
      // Emit event to App.vue
      this.$emit("register");
    },
  },
};
</script>
