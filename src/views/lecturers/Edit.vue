<template>
  <div>
    <b-card
      header="Edit a lecturer"
      header-text-variant="white"
      header-tag="header"
      header-bg-variant="dark"
      header-class="h4"
    >
      <b-form @submit.prevent="updateLecturer()" @reset="onReset()" novalidate>
        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Name -->
            <b-form-group id="name" label="Lecturer name:" label-for="name">
              <b-form-input
                id="name"
                v-model="lecturer.name"
                type="text"
                placeholder="Enter name"
                required
                :class="{
                  'is-invalid': submitted && $v.lecturer.name.$error,
                }"
              ></b-form-input>
              <!-- Error message for name -->
              <span
                v-if="submitted && !$v.lecturer.name.required"
                class="invalid-feedback"
              >
                Name is required
              </span>
              <span
                v-if="submitted && !$v.lecturer.name.isString"
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
                v-model="lecturer.email"
                type="email"
                placeholder="Enter email"
                required
                :class="{
                  'is-invalid':
                    (submitted && $v.lecturer.email.$error) || errors.email,
                }"
              ></b-form-input>
              <!-- Error message for email -->
              <span v-if="submitted && errors.email" class="invalid-feedback">{{
                errors.email[0]
              }}</span>
              <span
                v-if="submitted && !$v.lecturer.email.required"
                class="invalid-feedback"
                >Email is required</span
              >
              <span
                v-if="submitted && !$v.lecturer.email.email"
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
                v-model="lecturer.phone"
                type="text"
                placeholder="Enter phone"
                required
                :class="{ 'is-invalid': submitted && $v.lecturer.phone.$error }"
              ></b-form-input>
              <!-- Error message for phone -->
              <span
                v-if="submitted && !$v.lecturer.phone.required"
                class="invalid-feedback"
                >Phone is required</span
              >
              <span
                v-if="submitted && !$v.lecturer.phone.numeric"
                class="invalid-feedback"
                >Phone can only contain numbers</span
              >
              <span
                v-if="submitted && !$v.lecturer.phone.maxLength"
                class="invalid-feedback"
              >
                Phone cannot be more than
                {{ $v.lecturer.phone.$params.maxLength.max }} characters.
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
                v-model="lecturer.address"
                type="text"
                placeholder="Enter address"
                required
                :class="{
                  'is-invalid': submitted && $v.lecturer.address.$error,
                }"
              ></b-form-input>
              <!-- Error message for address -->
              <span
                v-if="submitted && !$v.lecturer.address.required"
                class="invalid-feedback"
                >Address is required</span
              >
              <span
                v-if="submitted && !$v.lecturer.address.maxLength"
                class="invalid-feedback"
              >
                Address cannot be more than
                {{ $v.lecturer.address.$params.maxLength.max }} characters.
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
        <b-button type="submit" variant="primary" class="mx-2">Update</b-button>
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
      errors: {},
      lecturer: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      submitted: false,
    };
  },
  validations: {
    lecturer: {
      name: { required, maxLength: maxLength(50) },
      email: { required, email },
      phone: { required, isPhoneNum, maxLength: maxLength(20) },
      address: {
        required,
        maxLength: maxLength(100),
      },
    },
  },
  created() {
    this.getLecturer();
  },
  methods: {
    getLecturer() {
      let token = localStorage.getItem("token");
      let id = this.$route.params.id;

      axios
        .get(`/lecturers/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.lecturer = response.data.data;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    updateLecturer() {
      let token = localStorage.getItem("token");
      this.submitted = true;
      let id = this.$route.params.id;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      console.log(this.lecturer);
      // else Post form
      axios
        .put(
          `/lecturers/${id}`,
          {
            name: this.lecturer.name,
            email: this.lecturer.email,
            phone: this.lecturer.phone,
            address: this.lecturer.address,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response);
          this.$emit("lecturerUpdated");
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
      this.lecturer.name = "";
      this.lecturer.phone = "";
      this.lecturer.email = "";
      this.lecturer.address = "";
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