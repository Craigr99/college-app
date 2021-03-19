<template>
  <div>
    <!-- Top section -->
    <div class="mb-3">
      <b-row class="align-items-center">
        <b-col>
          <span class="d-flex">
            <h2 class="mr-2">Courses</h2>
            <b-button
              class="align-self-center"
              variant="outline-primary"
              size="sm"
            >
              <router-link :to="{ name: 'courses_create' }">
                Add Course
              </router-link>
            </b-button>
          </span>
        </b-col>
        <b-col>
          <b-input-group>
            <b-form-input
              size="md"
              placeholder="Search for a course.."
              v-model="term"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="md"
                variant="outline-primary"
                @click="searchCourse()"
                >Search</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </div>

    <div
      v-if="loading"
      class="d-flex align-items-center"
      style="min-height: 75vh"
    >
      <b-spinner label="Loading..." class="mx-auto"></b-spinner>
    </div>
    <b-table
      v-else
      responsive
      striped
      hover
      :items="filteredCourses"
      :fields="fields"
      head-variant="dark"
    >
      <template #cell(title)="data">
        <router-link
          :to="{ name: 'courses_show', params: { id: data.item.id } }"
        >
          {{ data.item.title }}
        </router-link>
      </template>
      <template #cell(actions)="data">
        <router-link
          :to="{ name: 'courses_edit', params: { id: data.item.id } }"
        >
          Edit
        </router-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "@/config/api";

export default {
  name: "CourseIndex",
  components: {},
  data() {
    return {
      courses: [],
      loading: true,
      fields: [
        {
          key: "title",
          sortable: true,
        },
        {
          key: "code",
          sortable: true,
        },
        {
          key: "points",
          sortable: true,
        },
        {
          key: "level",
          sortable: true,
        },
        "Actions",
      ],
      term: "",
      filteredCourses: [],
    };
  },
  watch: {
    term: function () {
      this.searchCourse();
    },
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      let token = localStorage.getItem("token");
      axios
        .get("/courses", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.courses = response.data.data;
          this.filteredCourses = this.courses;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    searchCourse() {
      this.filteredCourses = this.courses.filter((course) => {
        // Check course title
        if (course.title.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check course code
        if (course.code.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
      });
    },
  },
};
</script>

<style></style>
