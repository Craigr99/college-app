<template>
  <div>
    <div>
      <b-card :title="course.title" :sub-title="course.code">
        <b-card-text>
          {{ course.description }}
        </b-card-text>

        <p>Points: {{ course.points }}</p>
        <p>Level: {{ course.level }}</p>
        <b-button href="#" variant="primary" class="mr-2">
          <router-link
            :to="{ name: 'courses_edit', params: { courseId: course.id } }"
            class="text-white"
          >
            Edit
          </router-link>
        </b-button>
        <b-button href="#" variant="danger">Delete</b-button>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CourseShow",
  components: {},
  data() {
    return {
      course: [],
    };
  },
  mounted() {
    this.getCourse();
  },
  methods: {
    getCourse() {
      let token = localStorage.getItem("token");
      let courseId = this.$route.params.courseId;

      axios
        .get(
          `https://craig-college-api.herokuapp.com/api/courses/${courseId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((response) => {
          console.log(response.data.data);
          this.course = response.data.data;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
  },
};
</script>

<style>
</style>