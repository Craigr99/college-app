<template>
  <div>
    <div>
      <b-card :title="course.title" :sub-title="course.code">
        <b-card-text>
          {{ course.description }}
        </b-card-text>

        <p>Points: {{ course.points }}</p>
        <p>Level: {{ course.level }}</p>

        <!-- Buttons -->
        <b-button href="#" variant="secondary" class="mr-2">
          <router-link
            :to="{ name: 'courses_index' }"
            class="flex align-items-center text-white"
          >
            <b-icon-arrow-left></b-icon-arrow-left>
            <span class="ml-1"> back</span>
          </router-link>
        </b-button>
        <b-button href="#" variant="primary" class="mr-2">
          <router-link
            :to="{ name: 'courses_edit', params: { id: course.id } }"
            class="text-white"
          >
            Edit
          </router-link>
        </b-button>
        <b-button href="#" variant="danger" @click="deleteCourse()"
          >Delete</b-button
        >
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CourseShow",
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
      let id = this.$route.params.id;

      axios
        .get(`https://craig-college-api.herokuapp.com/api/courses/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.course = response.data.data;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    deleteCourse() {
      if (this.course.enrolments.length > 0) {
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
              let id = this.$route.params.id;

              // loop through enrolments and send delete request to delete them
              this.course.enrolments.forEach((enrolment) => {
                console.log(enrolment.id);
                axios
                  .delete(
                    "https://craig-college-api.herokuapp.com/api/enrolments/" +
                      enrolment.id,
                    {
                      headers: { Authorization: "Bearer " + token },
                    }
                  )
                  .catch(function (error) {
                    console.log(error);
                  });
              });

              axios
                .delete(
                  `https://craig-college-api.herokuapp.com/api/courses/${id}`,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                )
                .then(() => {
                  this.$router.replace({ name: "courses_index" });
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
              let id = this.$route.params.id;
              axios
                .delete(
                  `https://craig-college-api.herokuapp.com/api/courses/${id}`,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                )
                .then(() => {
                  this.$router.replace({ name: "courses_index" });
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

<style>
</style>