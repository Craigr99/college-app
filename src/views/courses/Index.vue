<template>
  <div>
    <h1>this is the courses index page</h1>
    <br />

    <div v-for="course in courses" :key="course.id">
      <p>{{ course.title }}</p>
    </div>
    <button @click="logout()">Logout</button>
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
        .get("http://college.api:8000/api/courses", {
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
    logout() {
      let token = localStorage.getItem("token");
      axios
        .get("http://college.api:8000/api/logout", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data);
          console.log("Logged out");
          this.$router.replace({ name: "home" });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });

      localStorage.removeItem("token");
    },
  },
};
</script>

<style></style>
