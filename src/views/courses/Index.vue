<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h2>Courses</h2>
      <b-button variant="outline-primary" size="sm">
        <router-link :to="{ name: 'courses_create' }"> Add Course </router-link>
      </b-button>
    </div>

    <b-table striped hover :items="courses" :fields="fields">
      <template #cell(title)="data">
        <router-link
          :to="{ name: 'courses_show', params: { id: data.item.id } }"
        >
          {{ data.item.title }}
        </router-link>
      </template>
    </b-table>
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
      fields: [
        {
          key: "title",
          sortable: true,
        },
        "code",
        "points",
        {
          key: "level",
          sortable: true,
        },
      ],
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
