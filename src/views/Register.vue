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
      this.$emit("register");
    },
  },
};
</script>
