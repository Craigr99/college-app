<template>
  <div>
    <b-card>
      <b-form @submit.prevent="login()" @reset="onReset()" v-if="show">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
          description="We'll never share your email with anyone else."
        >
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
            :state="isEmailStateValid"
          ></b-form-input>
          <!-- Error message -->
          <span v-if="errors.email">
            <p v-for="error in errors.email" :key="error.id">
              <b-form-invalid-feedback :state="isEmailStateValid">
                {{ error }}
              </b-form-invalid-feedback>
            </p>
          </span>
        </b-form-group>

        <b-form-group id="password" label="Your Password:" label-for="password">
          <b-form-input
            id="password"
            type="password"
            v-model="form.password"
            placeholder="Enter password"
            required
            :class="errors.password ? 'is-invalid' : ''"
          ></b-form-input>
          <span v-if="errors.password">
            <p v-for="error in errors.password" :key="error.id">
              <b-form-invalid-feedback :state="validation">
                {{ error }}
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validation">
                Looks Good.
              </b-form-valid-feedback>
            </p>
          </span>
          <span v-if="errors === 'Unauthorised'">
            <b-form-invalid-feedback :state="false">
              {{ errors }} These credentials do not match our records.
            </b-form-invalid-feedback>
          </span>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
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
        email: "",
        password: "",
        checked: [],
      },
      show: true,
      errors: [],
    };
  },
  computed: {
    isEmailStateValid() {
      if (this.form.email) {
        return this.isValid(this.form.email);
      }
      return null;
    },
  },
  methods: {
    isValid() {
      return this.form.email.length > 3 ? true : false; //your validation criteria goes here
    },
    login() {
      axios
        .post("https://craig-college-api.herokuapp.com/api/login", {
          email: this.form.email,
          password: this.form.password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          this.$router.replace({ name: "user_dashboard" });
          this.$emit("has-token", true);
          this.$emit("login");
        })
        .catch((error) => {
          this.errors = error.response.data.error;
          console.log(this.errors);
        });
    },
    onReset() {
      // e.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.password = "";
      this.errors = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>
