<template>
  <div>
    <h1>this is the lecturers index page</h1>

    <div v-for="lecturer in lecturers" :key="lecturer.id" class="d-flex">
      <p><b>email: </b>{{ lecturer.email }}</p>
      <p><b>name: </b>{{ lecturer.name }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LecturerIndex",
  components: {},
  data() {
    return {
      lecturers: [],
    };
  },
  mounted() {
    this.getLecturers();
  },
  methods: {
    getLecturers() {
      let token = localStorage.getItem("token");
      axios
        .get("https://craig-college-api.herokuapp.com/api/lecturers", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.lecturers = response.data.data;
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
