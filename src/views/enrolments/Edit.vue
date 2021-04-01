<template>
  <div>
    <b-card>
      <h2 class="pt-3 pb-4">Edit an enrolment</h2>
      <b-form @submit.prevent="updateEnrolment()" @reset="onReset()" novalidate>
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
                :class="{
                  'is-invalid': submitted && $v.form.date.$error,
                }"
              ></b-form-datepicker>
              <!-- Error message for date -->
              <span
                v-if="submitted && !$v.form.date.required"
                class="invalid-feedback"
              >
                Date is required
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
                :class="{
                  'is-invalid': submitted && $v.form.time.$error,
                }"
              ></b-form-timepicker>
              <!-- Error message for time -->
              <span
                v-if="submitted && !$v.form.time.required"
                class="invalid-feedback"
              >
                Time is required
              </span>
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
              <b-form-select
                v-model="form.selectedLecturer"
                :class="{
                  'is-invalid':
                    (submitted && $v.form.selectedLecturer.$error) ||
                    errors.lecturer,
                }"
              >
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
              <!-- Error message for lecturer -->
              <span
                v-if="submitted && errors.lecturer"
                class="invalid-feedback d-block"
              >
                {{ errors.lecturer[0] }}
              </span>
              <span
                v-if="submitted && !$v.form.selectedLecturer.required"
                class="invalid-feedback"
              >
                Please choose a Lecturer
              </span>
            </b-form-group>
          </b-col>
          <b-col>
            <!-- Course  -->
            <b-form-group
              id="course"
              label="Enrolment course:"
              label-for="course"
            >
              <b-form-select
                v-model="form.selectedCourse"
                :class="{
                  'is-invalid':
                    (submitted && $v.form.selectedCourse.$error) ||
                    errors.course,
                }"
              >
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
              <!-- Error message for course -->
              <span
                v-if="submitted && errors.course"
                class="invalid-feedback d-block"
              >
                {{ errors.course[0] }}
              </span>
              <span
                v-if="submitted && !$v.form.selectedCourse.required"
                class="invalid-feedback"
              >
                Please choose a course
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
              <b-form-select
                v-model="form.status"
                :class="{
                  'is-invalid': submitted && $v.form.status.$error,
                }"
              >
                <b-form-select-option disabled :value="null"
                  >Please choose a status</b-form-select-option
                >
                <option value="interested">Interested</option>
                <option value="assigned">Assigned</option>
                <option value="associate">Associate</option>
                <option value="career_break">Career Break</option>
              </b-form-select>
              <!-- Error message for status -->
              <span
                v-if="submitted && !$v.form.status.required"
                class="invalid-feedback"
              >
                Please choose a status
              </span>
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
import { required } from "vuelidate/lib/validators";

export default {
  name: "LecturersEdit",
  data() {
    return {
      form: {
        date: null,
        time: null,
        selectedLecturer: null,
        selectedCourse: null,
        status: null,
      },
      errors: {
        lecturer: "",
        course: "",
      },
      show: true,
      submitted: false,
      lecturers: [],
      courses: [],
    };
  },
  validations: {
    form: {
      date: { required },
      time: { required },
      selectedLecturer: { required },
      selectedCourse: { required },
      status: { required },
    },
  },

  mounted() {
    this.getLecturers();
    this.getCourses();
    this.getEnrolment();
  },
  methods: {
    getEnrolment() {
      let id = this.$route.params.id;
      let token = localStorage.getItem("token");
      axios
        .get(`/enrolments/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log("res", response.data.data);
          this.form = response.data.data;
          this.form.selectedLecturer = response.data.data.lecturer_id;
          this.form.selectedCourse = response.data.data.course_id;
          this.form.status = response.data.data.status;
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
    updateEnrolment() {
      let token = localStorage.getItem("token");
      this.submitted = true;
      let id = this.$route.params.id;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // else Post form
      axios
        .put(
          `/enrolments/${id}`,
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
        .then(() => {
          this.$emit("enrolmentUpdated");
          this.$router.push({ name: "enrolments_index" });
        })
        .catch((error) => {
          if (error.response.data.errors) {
            this.errors.lecturer = error.response.data.errors.lecturer_id;
            this.errors.course = error.response.data.errors.course_id;
          }
        });
    },
    onReset() {
      // Reset our form values
      this.form.date = null;
      this.form.time = null;
      this.form.selectedLecturer = null;
      this.form.selectedCourse = null;
      this.form.status = null;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style></style>
