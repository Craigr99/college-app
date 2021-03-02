<template>
  <div>
    <b-card>
      <b-form @submit.prevent="createCourse()" @reset="onReset()">
        <b-form-group id="title" label="Course title:" label-for="title">
          <b-form-input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Enter title"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="code" label="Course code:" label-for="code">
          <b-form-input
            id="code"
            v-model="form.code"
            type="text"
            placeholder="Enter code"
            required
          ></b-form-input>
        </b-form-group>
        <span v-if="errors.code">
          {{ errors.code }}
        </span>
        <b-form-group
          id="description"
          label="Course description:"
          label-for="description"
        >
          <b-form-input
            id="description"
            v-model="form.description"
            type="text"
            placeholder="Enter description"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="points" label="Course points:" label-for="points">
          <b-form-input
            id="points"
            v-model="form.points"
            type="text"
            placeholder="Enter points"
            required
          ></b-form-input>
          <span v-if="errors.points">
            <p v-for="error in errors.points" :key="error">
              {{ error }}
            </p>
          </span>
        </b-form-group>
        <b-form-group id="level" label="Course level:" label-for="level">
          <b-form-input
            id="level"
            v-model="form.level"
            type="text"
            placeholder="Enter level"
            required
          ></b-form-input>
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
    };
  },
  methods: {
    createCourse() {
      let token = localStorage.getItem("token");

      axios
        .post(
          "https://craig-college-api.herokuapp.com/api/courses",
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
      // e.preventDefault();
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