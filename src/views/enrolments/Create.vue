<template>
  <div>
    <b-card>
      <h2 class="pt-3 pb-4">Add a new enrolment</h2>
      <b-form @submit.prevent="createEnrolment()" @reset="onReset()" novalidate>
        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Date -->
            <b-form-group id="date" label="Enrolment date:" label-for="date">
              <b-form-datepicker
                v-model="form.date"
                today-button
                reset-button
                close-button
                locale="en"
                placeholder="Choose a date"
              ></b-form-datepicker>
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
            <!-- Time -->
            <b-form-group id="time" label="Enrolment time:" label-for="time">
              <b-form-timepicker
                v-model="form.time"
                now-button
                reset-button
                locale="en"
                placeholder="Choose a time"
              ></b-form-timepicker>
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
            <!-- Lecturer -->
            <b-form-group
              id="enrolment-lecturer"
              label="Enrolment lecturer:"
              label-for="enrolment-lecturer"
            >
              <b-form-select v-model="form.selectedLecturer">
                <b-form-select-option disabled :value="null"
                  >Please choose a lecturer</b-form-select-option
                >
                <option
                  v-for="lecturer in lecturers"
                  :key="lecturer.id"
                  :value="lecturer.id"
                >
                  {{ lecturer.name }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <!-- Course  -->
            <b-form-group
              id="course"
              label="Enrolment course:"
              label-for="course"
            >
              <b-form-select v-model="form.selectedCourse">
                <b-form-select-option disabled :value="null"
                  >Please choose a course</b-form-select-option
                >
                <option
                  v-for="course in courses"
                  :key="course.id"
                  :value="course.id"
                >
                  {{ course.title }}
                </option>
              </b-form-select>
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
        <b-row cols="1" cols-md="2">
          <b-col>
            <b-form-group
              id="status"
              label="Enrolment status:"
              label-for="status"
            >
              <!-- Status -->
              <b-form-select v-model="form.status">
                <b-form-select-option disabled :value="null"
                  >Please choose a status</b-form-select-option
                >
                <option value="interested">Interested</option>
                <option value="assigned">Assigned</option>
                <option value="associate">Associate</option>
                <option value="career_break">Career Break</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Buttons  -->
        <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'enrolments_index' }"
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
        date: null,
        time: null,
        selectedLecturer: null,
        selectedCourse: null,
        status: null,
      },
      errors: {},
      show: true,
      submitted: false,
      lecturers: [],
      courses: [],
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

  mounted() {
    this.getLecturers();
    this.getCourses();
  },
  methods: {
    getLecturers() {
      let token = localStorage.getItem("token");
      axios
        .get("/lecturers", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.lecturers = response.data.data;
          console.log(this.lecturers);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    getCourses() {
      let token = localStorage.getItem("token");
      axios
        .get("/courses", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.courses = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createEnrolment() {
      let token = localStorage.getItem("token");
      this.submitted = true;

      // stop here if form is invalid
      //   this.$v.$touch();
      //   if (this.$v.$invalid) {
      //     return;
      //   }
      // else Post form
      axios
        .post(
          "/enrolments",
          {
            date: this.form.date,
            time: this.form.time,
            lecturer_id: this.form.selectedLecturer,
            course_id: this.form.selectedCourse,
            status: this.form.status,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response);
          this.$emit("enrolmentCreated");
          this.$router.push({ name: "enrolments_index" });
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