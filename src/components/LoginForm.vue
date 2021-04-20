<template>
  <div>
    <b-row class="justify-content-md-center">
      <b-col md="8">
        <b-card
          header="Login to your account"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          header-class="h4 font-weight-normal"
        >
          <b-form
            @submit.prevent="login()"
            @reset="onReset()"
            v-if="show"
            novalidate
          >
            <!-- Email -->
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
                :class="{
                  'is-invalid':
                    (submitted && $v.form.email.$error) ||
                    errors.email ||
                    errors[0],
                }"
              ></b-form-input>
              <!-- Error message for email -->
              <span v-if="submitted && errors[0]" class="invalid-feedback">{{
                errors
              }}</span>
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
            <b-form-group
              id="password"
              label="Your Password:"
              label-for="password"
            >
              <b-form-input
                id="password"
                type="password"
                v-model="form.password"
                placeholder="Enter password"
                required
                :class="{
                  'is-invalid': submitted && $v.form.password.$error,
                }"
              ></b-form-input>
              <!-- Error messages for password -->
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

            <b-form-group>
              <span>
                Don't have an account?
                <router-link :to="{ name: 'register' }"> Register</router-link>
              </span>
            </b-form-group>

            <b-button type="submit" variant="primary" class="mr-2"
              >Login</b-button
            >
            <b-button type="reset" variant="secondary" @click="$v.$reset"
              >Reset</b-button
            >
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "@/config/api";
import { required, minLength, email } from "vuelidate/lib/validators";

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
      errors: {},
      submitted: false,
    };
  },
  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    },
  },
  methods: {
    login() {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // else Post form
      axios
        .post("/login", {
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
          if (error.response.data) {
            this.errors = error.response.data.error;
            console.log(this.errors);
          }
        });
    },
    onReset() {
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