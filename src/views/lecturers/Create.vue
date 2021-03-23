<template>
  <div>
    <b-card>
      <h2 class="pt-3 pb-4">Add a new lecturer</h2>
      <b-form @submit.prevent="createLecturer()" @reset="onReset()" novalidate>
        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Name -->
            <b-form-group id="name" label="Lecturer name:" label-for="name">
              <b-form-input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter name"
                required
                :class="{
                  'is-invalid': submitted && $v.form.name.$error,
                }"
              ></b-form-input>
              <!-- Error message for name -->
              <span
                v-if="submitted && !$v.form.name.required"
                class="invalid-feedback"
              >
                Name is required
              </span>
              <span
                v-if="submitted && !$v.form.name.isString"
                class="invalid-feedback"
              >
                Name can contain letters only
              </span>
            </b-form-group>
          </b-col>

          <b-col>
            <!-- Email -->
            <b-form-group id="email" label="Lecturer email:" label-for="email">
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
                :class="{
                  'is-invalid':
                    (submitted && $v.form.email.$error) || errors.email,
                }"
              ></b-form-input>
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
          </b-col>
        </b-row>

        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Phone -->
            <b-form-group id="phone" label="Lecturer phone:" label-for="phone">
              <b-form-input
                id="phone"
                v-model="form.phone"
                type="text"
                placeholder="Enter phone"
                required
                :class="{ 'is-invalid': submitted && $v.form.phone.$error }"
              ></b-form-input>
              <!-- Error message for phone -->
              <span
                v-if="submitted && !$v.form.phone.required"
                class="invalid-feedback"
                >Phone is required</span
              >
              <span
                v-if="submitted && !$v.form.phone.numeric"
                class="invalid-feedback"
                >Phone can only contain numbers</span
              >
              <span
                v-if="submitted && !$v.form.phone.maxLength"
                class="invalid-feedback"
              >
                Phone cannot be more than
                {{ $v.form.phone.$params.maxLength.max }} characters.
              </span>
            </b-form-group>
          </b-col>
          <b-col>
            <!-- Address  -->
            <b-form-group
              id="address"
              label="Lecturer address:"
              label-for="address"
            >
              <b-form-input
                id="address"
                v-model="form.address"
                type="text"
                placeholder="Enter address"
                required
                :class="{ 'is-invalid': submitted && $v.form.address.$error }"
              ></b-form-input>
              <!-- Error message for address -->
              <span
                v-if="submitted && !$v.form.address.required"
                class="invalid-feedback"
                >Address is required</span
              >
              <span
                v-if="submitted && !$v.form.address.maxLength"
                class="invalid-feedback"
              >
                Address cannot be more than
                {{ $v.form.address.$params.maxLength.max }} characters.
              </span>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Buttons  -->
        <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'lecturers_index' }"
            class="flex align-items-center text-white"
          >
            <b-icon-arrow-left></b-icon-arrow-left>
            <span class="ml-1"> back</span>
          </router-link>
        </b-button>
        <b-button type="submit" variant="primary" class="mx-2">Submit</b-button>
        <b-button type="reset" variant="danger" @click="$v.$reset"
          >Reset</b-button
        >
      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from "@/config/api";
import { required, maxLength, email, helpers } from "vuelidate/lib/validators";
const isPhoneNum = helpers.regex("isPhoneNum", /^[0-9_ ]*$/i);

export default {
  name: "LecturersCreate",
  data() {
    return {
      form: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      errors: {},
      show: true,
      submitted: false,
    };
  },
  validations: {
    form: {
      name: { required, maxLength: maxLength(50) },
      email: { required, email },
      phone: { required, isPhoneNum, maxLength: maxLength(20) },
      address: {
        required,
        maxLength: maxLength(100),
      },
    },
  },
  methods: {
    createLecturer() {
      let token = localStorage.getItem("token");
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // else Post form
      axios
        .post(
          "/lecturers",
          {
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            address: this.form.address,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response);
          this.$router.push({ name: "lecturers_index" });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
          if (error.response.data.errors) {
            this.errors = error.response.data.errors;
          }
        });
    },
    onReset() {
      // Reset our form values
      this.form.name = "";
      this.form.phone = "";
      this.form.email = "";
      this.form.address = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style>
</style>