<template>
  <div>
    <b-card>
      <b-form
        @submit.prevent="register()"
        @reset="onReset()"
        v-if="show"
        novalidate
      >
        <!-- Name -->
        <b-form-group id="name" label="Name:" label-for="name">
          <b-form-input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required
            :class="{
              'is-invalid': submitted && $v.form.name.$error,
            }"
          />
          <!-- Error message for name -->
          <span
            v-if="submitted && !$v.form.name.required"
            class="invalid-feedback"
            >Name is required</span
          >
          <span
            v-if="submitted && !$v.form.name.minLength"
            class="invalid-feedback"
            >Name must be {{ $v.form.name.$params.minLength.min }} characters.
          </span>
        </b-form-group>

        <!-- Email  -->
        <b-form-group id="email" label="Email address:" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
            :class="{
              'is-invalid': (submitted && $v.form.email.$error) || errors.email,
            }"
          />
          <!-- Error message for email -->
          <span v-if="submitted && errors.email" class="invalid-feedback">{{
            errors.email[0]
          }}</span>
          <span
            v-if="submitted && !$v.form.email.required"
            class="invalid-feedback"
            >Email is required</span
          >
          <span
            v-if="submitted && !$v.form.email.email"
            class="invalid-feedback"
            >Must be a valid email (example@gmail.com)</span
          >
        </b-form-group>

        <!-- Password -->
        <b-form-group id="password" label="Your Password:" label-for="password">
          <b-form-input
            id="password"
            type="password"
            v-model.trim="form.password"
            placeholder="Enter password"
            required
            :class="{
              'is-invalid': submitted && $v.form.password.$error,
            }"
          />
          <!-- Error message for password -->
          <span
            v-if="submitted && !$v.form.password.required"
            class="invalid-feedback"
            >Password is required</span
          >
          <span
            v-if="submitted && !$v.form.password.minLength"
            class="invalid-feedback"
            >Password must be
            {{ $v.form.password.$params.minLength.min }} characters.
          </span>
        </b-form-group>

        <!-- REPEAT Password -->
        <b-form-group
          id="repeat_password"
          label="Repeat Password:"
          label-for="repeat_password"
        >
          <b-form-input
            id="repeat_password"
            type="password"
            v-model.trim="form.repeatPassword"
            placeholder="Repeat password"
            required
            :class="{
              'is-invalid': submitted && $v.form.repeatPassword.$error,
            }"
          />
          <!-- Error message for repeat password -->
          <span
            v-if="!$v.form.repeatPassword.sameAsPassword"
            class="invalid-feedback"
            >Passwords must be identical</span
          >
        </b-form-group>

        <b-button type="submit" variant="primary">Register</b-button>
        <b-button type="reset" variant="danger" @click="$v.$reset"
          >Reset</b-button
        >
      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";

export default {
  name: "LoginForm",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
      },
      errors: {},
      show: true,
      submitted: false,
    };
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3) },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      repeatPassword: {
        sameAsPassword: sameAs("password"),
      },
    },
  },
  methods: {
    register() {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // else Post form
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
          this.$emit("register");
        })
        .catch((error) => {
          if (error.response.data) {
            this.errors = error.response.data;
            console.log(this.errors);
          }
        });
    },
    onReset() {
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
