<template>
  <div>
    <b-card
      header="Add a new course"
      header-text-variant="white"
      header-tag="header"
      header-bg-variant="dark"
      header-class="h4 "
    >
      <b-form @submit.prevent="createCourse()" @reset="onReset()" novalidate>
        <b-row cols="1" cols-md="2">
          <b-col>
            <!-- Title -->
            <b-form-group id="title" label="Course title:" label-for="title">
              <b-form-input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="Enter title"
                required
                :class="{
                  'is-invalid': submitted && $v.form.title.$error,
                }"
              ></b-form-input>
              <!-- Error message for title -->
              <span
                v-if="submitted && !$v.form.title.required"
                class="invalid-feedback"
              >
                Title is required
              </span>
              <span
                v-if="submitted && !$v.form.title.isString"
                class="invalid-feedback"
              >
                Title can contain letters only
              </span>

              <span
                v-if="submitted && !$v.form.title.maxLength"
                class="invalid-feedback"
              >
                Title cannot be more than
                {{ $v.form.title.$params.maxLength.max }} characters.
              </span>
            </b-form-group>
          </b-col>

          <b-col>
            <!-- Code -->
            <b-form-group id="code" label="Course code:" label-for="code">
              <b-form-input
                id="code"
                v-model="form.code"
                type="text"
                placeholder="Enter code"
                required
                :class="{ 'is-invalid': submitted && $v.form.code.$error }"
              ></b-form-input>
              <!-- Error message for code -->
              <span
                v-if="submitted && !$v.form.code.required"
                class="invalid-feedback"
              >
                Course code is required
              </span>
              <span
                v-if="submitted && !$v.form.code.maxLength"
                class="invalid-feedback"
              >
                Course code cannot be more than
                {{ $v.form.code.$params.maxLength.max }} characters.
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
                v-model="form.points"
                type="text"
                placeholder="Enter points"
                required
                :class="{
                  'is-invalid':
                    (submitted && $v.form.points.$error) || errors.points,
                }"
              ></b-form-input>
              <!-- Error message for points -->
              <span
                v-if="submitted && !$v.form.points.required"
                class="invalid-feedback"
                >Points is required</span
              >
              <span
                v-if="submitted && !$v.form.points.between"
                class="invalid-feedback"
                >Points must be between
                {{ $v.form.points.$params.between.min }} and
                {{ $v.form.points.$params.between.max }}</span
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
                v-model="form.level"
                type="text"
                placeholder="Enter level"
                required
                :class="{
                  'is-invalid':
                    (submitted && $v.form.level.$error) || errors.level,
                }"
              ></b-form-input>
              <!-- Error message for level -->
              <span
                v-if="submitted && !$v.form.level.required"
                class="invalid-feedback"
                >Level is required</span
              >
              <span
                v-if="submitted && !$v.form.level.between"
                class="invalid-feedback"
                >Level must be between
                {{ $v.form.level.$params.between.min }} and
                {{ $v.form.level.$params.between.max }}</span
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
            v-model="form.description"
            type="text"
            placeholder="Enter description"
            required
            rows="6"
            :class="{ 'is-invalid': submitted && $v.form.description.$error }"
          ></b-form-textarea>
          <!-- Error message for description -->
          <span
            v-if="submitted && !$v.form.description.required"
            class="invalid-feedback"
          >
            Description is required
          </span>

          <!-- Points -->
        </b-form-group>

        <!-- Buttons  -->
        <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'courses_index' }"
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
import {
  required,
  maxLength,
  integer,
  between,
  helpers,
} from "vuelidate/lib/validators";
const isString = helpers.regex("isString", /^[a-z_ ]*$/i);

export default {
  name: "CourseCreate",
  data() {
    return {
      form: {
        title: "",
        code: "",
        description: "",
        points: "",
        level: "",
      },
      errors: {},
      show: true,
      submitted: false,
    };
  },
  validations: {
    form: {
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
  methods: {
    createCourse() {
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
          "/courses",
          {
            title: this.form.title,
            code: this.form.code,
            description: this.form.description,
            points: this.form.points,
            level: this.form.level,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response);
          this.$emit("courseCreated");
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
      this.form.title = "";
      this.form.code = "";
      this.form.description = "";
      this.form.points = "";
      this.form.level = "";
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