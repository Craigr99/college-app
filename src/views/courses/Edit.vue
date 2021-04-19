<template>
  <div>
    <b-card
      header="Edit a course"
      header-text-variant="white"
      header-tag="header"
      header-bg-variant="dark"
      header-class="h4 "
    >
      <b-form @submit.prevent="updateCourse()" @reset="onReset()" novalidate>
        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Title -->
            <b-form-group id="title" label="Course title:" label-for="title">
              <b-form-input
                id="title"
                v-model="course.title"
                type="text"
                placeholder="Enter title"
                required
                :class="{
                  'is-invalid': submitted && $v.course.title.$error,
                }"
              ></b-form-input>
              <!-- Error messages for title -->
              <span
                v-if="submitted && !$v.course.title.required"
                class="invalid-feedback"
              >
                Title is required
              </span>

              <span
                v-if="submitted && !$v.course.title.isString"
                class="invalid-feedback"
              >
                Title can contain letters only
              </span>

              <span
                v-if="submitted && !$v.course.title.maxLength"
                class="invalid-feedback"
              >
                Title cannot be more than
                {{ $v.course.title.$params.maxLength.max }} characters.
              </span>
            </b-form-group>
          </b-col>

          <b-col>
            <!-- Code -->
            <b-form-group id="code" label="Course code:" label-for="code">
              <b-form-input
                id="code"
                v-model="course.code"
                type="text"
                placeholder="Enter code"
                required
                :class="{ 'is-invalid': submitted && $v.course.code.$error }"
              ></b-form-input>
              <!-- Error message for code -->
              <span
                v-if="submitted && !$v.course.code.required"
                class="invalid-feedback"
              >
                Course code is required
              </span>
              <span
                v-if="submitted && !$v.course.code.maxLength"
                class="invalid-feedback"
              >
                Course code cannot be more than
                {{ $v.course.code.$params.maxLength.max }} characters.
              </span>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Points -->
            <b-form-group id="points" label="Course points:" label-for="points">
              <b-form-input
                id="points"
                v-model="course.points"
                type="text"
                placeholder="Enter points"
                required
                :class="{
                  'is-invalid':
                    (submitted && $v.course.points.$error) || errors.points,
                }"
              ></b-form-input>
              <!-- Error message for points -->
              <span
                v-if="submitted && !$v.course.points.required"
                class="invalid-feedback"
                >Points is required</span
              >
              <span
                v-if="submitted && !$v.course.points.between"
                class="invalid-feedback"
                >Points must be between
                {{ $v.course.points.$params.between.min }} and
                {{ $v.course.points.$params.between.max }}</span
              >
              <span
                v-if="submitted && errors.points"
                class="invalid-feedback"
                >{{ errors.points[0] }}</span
              >
            </b-form-group>
          </b-col>
          <b-col>
            <!-- Level  -->
            <b-form-group id="level" label="Course level:" label-for="level">
              <b-form-input
                id="level"
                v-model="course.level"
                type="text"
                placeholder="Enter level"
                required
                :class="{
                  'is-invalid':
                    (submitted && $v.course.level.$error) || errors.level,
                }"
              ></b-form-input>
              <!-- Error message for level -->
              <span
                v-if="submitted && !$v.course.level.required"
                class="invalid-feedback"
                >Level is required</span
              >
              <span
                v-if="submitted && !$v.course.level.between"
                class="invalid-feedback"
                >Level must be between
                {{ $v.course.level.$params.between.min }} and
                {{ $v.course.level.$params.between.max }}</span
              >
              <span v-if="submitted && errors.level" class="invalid-feedback">{{
                errors.level[0]
              }}</span>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Description -->
        <b-form-group
          id="description"
          label="Course description:"
          label-for="description"
        >
          <b-form-textarea
            id="description"
            v-model="course.description"
            type="text"
            placeholder="Enter description"
            required
            rows="6"
            :class="{ 'is-invalid': submitted && $v.course.description.$error }"
          ></b-form-textarea>
          <!-- Error message for description -->
          <span
            v-if="submitted && !$v.course.description.required"
            class="invalid-feedback"
          >
            Description is required
          </span>

          <!-- Points -->
        </b-form-group>

        <!-- Buttons -->
        <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'courses_index' }"
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

import {
  required,
  maxLength,
  integer,
  between,
  helpers,
} from "vuelidate/lib/validators";
const isString = helpers.regex("isString", /^[a-z_ ]*$/i);

export default {
  name: "CourseEdit",
  data() {
    return {
      errors: {},
      course: {
        title: "",
        code: "",
        description: "",
        points: "",
        level: "",
      },
      submitted: false,
    };
  },
  validations: {
    course: {
      title: { required, isString, maxLength: maxLength(50) },
      code: { required, maxLength: maxLength(5) },
      description: { required },
      points: {
        required,
        integer,
        between: between(100, 600),
      },
      level: {
        required,
        integer,
        between: between(7, 10),
      },
    },
  },
  created() {
    this.getCourse();
  },
  methods: {
    getCourse() {
      let token = localStorage.getItem("token");
      let id = this.$route.params.id;

      axios
        .get(`/courses/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.course = response.data.data;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    updateCourse() {
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
          `/courses/${id}`,
          {
            title: this.course.title,
            code: this.course.code,
            description: this.course.description,
            points: this.course.points,
            level: this.course.level,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response);
          this.$emit("courseUpdated");
          this.$router.push({ name: "courses_index" });
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
      this.course.title = "";
      this.course.code = "";
      this.course.description = "";
      this.course.points = "";
      this.course.level = "";
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

<style>
</style>