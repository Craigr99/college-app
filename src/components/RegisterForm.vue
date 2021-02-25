<template>
  <div>
    <b-card>
      <b-form @submit.prevent="register()" @reset="onReset()" v-if="show">
        <b-form-group id="name" label="Name:" label-for="name">
          <b-form-input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="email" label="Email address:" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="password" label="Your Password:" label-for="password">
          <b-form-input
            id="password"
            type="password"
            v-model="form.password"
            placeholder="Enter password"
            required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Register</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        checked: [],
      },
      show: true,
    };
  },
  methods: {
    register() {
      axios
        .post("https://craig-college-api.herokuapp.com/api/register", {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          this.$router.replace({ name: "user_dashboard" });
          this.$emit("has-token", true);
          this.$emit("registering-user", true);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.password = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>
