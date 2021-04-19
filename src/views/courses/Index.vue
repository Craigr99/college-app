<template>
  <div>
    <!-- Top section -->
    <div class="mb-3">
      <b-row cols="1" cols-sm="2" class="align-items-center">
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
          :to="{ name: 'courses_show', params: { id: data.item.id } }"
        >
          <b-button size="sm" variant="outline-primary"
            ><b-icon-eye
          /></b-button>
        </router-link>
        <router-link
          :to="{ name: 'courses_edit', params: { id: data.item.id } }"
        >
          <b-button
            size="sm"
            variant="outline-secondary"
            class="mx-md-2 my-2 my-md-0"
            ><b-icon-pen
          /></b-button>
        </router-link>
        <b-button
          size="sm"
          variant="outline-danger"
          @click="deleteCourse(data.item.id)"
          ><b-icon-trash
        /></b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "@/config/api";

export default {
  name: "CourseIndex",
  data() {
    return {
      courses: [],
      course: [],
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
  mounted() {
    this.getCourses();
  },
  watch: {
    term: function () {
      this.searchCourse();
    },
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
    getCourse(id) {
      let token = localStorage.getItem("token");

      axios
        .get(`/courses/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.course = response.data.data;
        })
        .catch((error) => {
          console.log(error);
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
    deleteCourse(id) {
      this.getCourse(id);

      if (this.course && this.course.enrolments.length) {
        //If course has enrolments
        this.$bvModal
          .msgBoxConfirm(
            "Please confirm that you want to delete the course. WARNING: the enrolments for this course will also be deleted!",
            {
              title: "Please Confirm",
              okVariant: "danger",
              okTitle: "DELETE",
              headerBgVariant: "dark",
              headerTextVariant: "light",
              cancelTitle: "BACK",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            }
          )
          .then((value) => {
            if (value === true) {
              //DELETE
              let token = localStorage.getItem("token");

              // loop through enrolments and send delete request to delete them
              this.course.enrolments.forEach((enrolment) => {
                axios
                  .delete("/enrolments/" + enrolment.id, {
                    headers: { Authorization: "Bearer " + token },
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              });

              axios
                .delete(`/courses/${id}`, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then(() => {
                  this.$emit("courseDeleted");
                  this.getCourses();
                })
                .catch((error) => {
                  console.log(error);
                  console.log(error.response.data);
                });
            }
          })
          .catch((err) => {
            // An error occurred
            console.log(err);
          });
      } else {
        // Course has no enrolments
        this.$bvModal
          .msgBoxConfirm("Please confirm that you want to delete the course.", {
            title: "Please Confirm",
            okVariant: "danger",
            okTitle: "DELETE",
            headerBgVariant: "dark",
            headerTextVariant: "light",
            cancelTitle: "BACK",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          })
          .then((value) => {
            if (value === true) {
              //DELETE
              let token = localStorage.getItem("token");
              axios
                .delete(`/courses/${id}`, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then(() => {
                  this.$emit("courseDeleted");
                  this.getCourses();
                })
                .catch((error) => {
                  console.log(error);
                  console.log(error.response.data);
                });
            }
          })
          .catch((err) => {
            // An error occurred
            console.log(err);
          });
      }
    },
  },
};
</script>

<style></style>
