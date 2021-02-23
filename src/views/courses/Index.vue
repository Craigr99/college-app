<template>
  <div>
    <h1>this is the courses index page</h1>
    <br />

    <div v-for="course in courses" :key="course.id">
      <router-link
        :to="{ name: 'courses_show', params: { courseId: course.id } }"
      >
        <p>{{ course.title }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CourseIndex",
  components: {},
  data() {
    return {
      courses: [],
    };
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      let token = localStorage.getItem("token");
      axios
        .get("https://craig-college-api.herokuapp.com/api/courses", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.courses = response.data.data;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
  },
};
</script>

<style></style>
