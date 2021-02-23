<template>
  <div>
    <h1>this is the enrolments index page</h1>

    <div v-for="enrolment in enrolments" :key="enrolment.id" class="d-flex">
      <p><b>Course: </b>{{ enrolment.course.title }}</p>
      <p><b>Lecturer: </b>{{ enrolment.lecturer.name }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EnrolmentIndex",
  components: {},
  data() {
    return {
      enrolments: [],
    };
  },
  mounted() {
    this.getEnrolments();
  },
  methods: {
    getEnrolments() {
      let token = localStorage.getItem("token");
      axios
        .get("https://craig-college-api.herokuapp.com/api/enrolments", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.enrolments = response.data.data;
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
