<template>
  <div>
    <b-skeleton-wrapper :loading="loading">
      <!-- Loading skeleton card -->
      <template #loading>
        <b-card class="py-2">
          <b-skeleton width="40%"></b-skeleton>
          <b-skeleton width="10%" class="my-2"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="20%" class="my-4"></b-skeleton>
          <b-skeleton width="10%"></b-skeleton>
          <div class="d-flex mt-3">
            <b-skeleton width="10%" type="button"></b-skeleton>
            <b-skeleton width="10%" type="button" class="mx-2"></b-skeleton>
            <b-skeleton width="10%" type="button"></b-skeleton>
          </div>
        </b-card>
      </template>

      <b-card
        header="Course"
        header-text-variant="white"
        header-tag="header"
        header-bg-variant="dark"
        :title="course.title"
        :sub-title="course.code"
      >
        <b-card-text>
          {{ course.description }}
        </b-card-text>

        <p>Points: {{ course.points }}</p>
        <p>Level: {{ course.level }}</p>

        <!-- Buttons -->
        <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'courses_index' }"
            class="flex align-items-center text-white"
          >
            <b-icon-arrow-left></b-icon-arrow-left>
            <span class="ml-1"> back</span>
          </router-link>
        </b-button>
        <b-button href="#" variant="primary" class="mx-2">
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
    </b-skeleton-wrapper>

    <!-- Course Enrolments -->
    <b-card class="mt-5">
      <div v-if="loading" class="d-flex align-items-center mt-5">
        <b-spinner label="Loading..." class="mx-auto"></b-spinner>
      </div>
      <div v-else>
        <span class="d-flex">
          <h4 class="mr-2">Course Enrolments</h4>
          <b-button
            class="align-self-center"
            variant="outline-primary"
            size="sm"
            @click="newEnrolment(course.id)"
          >
            Add Enrolment
          </b-button>
        </span>
        <b-table
          responsive
          striped
          hover
          :items="course.enrolments"
          :fields="fields"
          head-variant="dark"
          class="mt-3"
        >
          <!-- Date -->
          <template #cell(date)="data">
            {{ moment(data.item.date).format("DD-MM-YYYY") }}
          </template>
          <!-- Time -->
          <template #cell(time)="data">
            {{ moment(data.item.time, "HH:mm:ss").format("HH:mm A") }}
          </template>
          <!-- status -->
          <template #cell(status)="data">
            <router-link
              :to="{ name: 'enrolments_show', params: { id: data.item.id } }"
            >
              {{ data.item.status === "career_break" ? "Career Break" : "" }}
              {{ data.item.status === "assigned" ? "Assigned" : "" }}
              {{ data.item.status === "associate" ? "Associate" : "" }}
              {{ data.item.status === "interested" ? "Interested" : "" }}
            </router-link>
          </template>
          <template #cell(lecturer)="data">
            <router-link
              :to="{
                name: 'lecturers_show',
                params: { id: data.item.lecturer.id },
              }"
            >
              {{ data.item.lecturer.name }}
            </router-link>
          </template>
          <template #cell(actions)="data">
            <router-link
              :to="{ name: 'enrolments_show', params: { id: data.item.id } }"
            >
              <b-button size="sm" variant="outline-primary"
                ><b-icon-eye
              /></b-button>
            </router-link>
            <router-link
              :to="{ name: 'enrolments_edit', params: { id: data.item.id } }"
            >
              <b-button
                size="sm"
                variant="outline-secondary"
                class="mx-lg-2 my-2 my-lg-0"
                ><b-icon-pen
              /></b-button>
            </router-link>
          </template>
        </b-table>
      </div>
    </b-card>
  </div>
</template>

<script>
import axios from "@/config/api";

export default {
  name: "CourseShow",
  data() {
    return {
      course: [],
      loading: true,
      fields: [
        {
          key: "date",
          sortable: true,
        },
        {
          key: "time",
          sortable: true,
        },
        {
          key: "status",
          sortable: true,
        },
        {
          key: "lecturer",
          label: "Lecturer",
          sortable: true,
        },
        "Actions",
      ],
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
        .get(`/courses/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.course = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    newEnrolment(id) {
      let data = {
        courseId: id,
      };
      this.$router.push({
        name: "enrolments_create",
        params: { data },
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
                .delete(`/courses/${id}`, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then(() => {
                  this.$emit("courseDeleted");
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
    getEnrolment(id) {
      let token = localStorage.getItem("token");

      axios
        .get(`/enrolments/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.course = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteEnrolment(id) {
      this.getEnrolment(id);
      console.log("here");

      // this.$bvModal
      //   .msgBoxConfirm(
      //     "Please confirm that you want to delete the enrolment.",
      //     {
      //       title: "Please Confirm",
      //       okVariant: "danger",
      //       okTitle: "DELETE",
      //       headerBgVariant: "dark",
      //       headerTextVariant: "light",
      //       cancelTitle: "BACK",
      //       footerClass: "p-2",
      //       hideHeaderClose: false,
      //       centered: true,
      //     }
      //   )
      //   .then((value) => {
      //     if (value === true) {
      //       //DELETE
      //       let token = localStorage.getItem("token");
      //       axios
      //         .delete(`/enrolments/${id}`, {
      //           headers: { Authorization: "Bearer " + token },
      //         })
      //         .then(() => {
      //           this.$emit("enrolmentDeleted");
      //           this.getEnrolments();
      //         })
      //         .catch((error) => {
      //           console.log(error);
      //         });
      //     }
      //   })
      //   .catch((err) => {
      //     // An error occurred
      //     console.log(err);
      //   });
    },
  },
};
</script>

<style>
</style>