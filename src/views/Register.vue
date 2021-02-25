<template>
  <div class="register">
    <RegisterForm @registering-user="registeringUser()" />
  </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm.vue";

export default {
  name: "Login",
  components: { RegisterForm },
  methods: {
    registeringUser() {
      this.$emit("registering-user", true);
    },
  },
};
</script>
