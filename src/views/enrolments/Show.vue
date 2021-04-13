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

      <b-card>
        <b-card-text>
          <h2>Date: {{ enrolment.date }}</h2>
          <h2>Status: {{ enrolment.status }}</h2>
          <h2>Lecturer: {{ enrolment.lecturer.name }}</h2>
          <!-- {{ enrolment.lecturer.name }} -->
        </b-card-text>

        <!-- Buttons -->
        <!-- <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'lecturers_index' }"
            class="flex align-items-center text-white"
          >
            <b-icon-arrow-left></b-icon-arrow-left>
            <span class="ml-1"> back</span>
          </router-link>
        </b-button>

        <b-button href="#" variant="primary" class="mx-2">
          <router-link
            :to="{ name: 'lecturers_edit', params: { id: lecturer.id } }"
            class="text-white"
          >
            Edit
          </router-link>
        </b-button>
        <b-button href="#" variant="danger" @click="deleteLecturer()"
          >Delete</b-button
        > -->
      </b-card>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
import axios from "@/config/api";

export default {
  name: "EnrolmentShow",
  data() {
    return {
      enrolment: [],
      loading: true,
    };
  },
  mounted() {
    this.getEnrolment();
  },
  methods: {
    getEnrolment() {
      let token = localStorage.getItem("token");
      let id = this.$route.params.id;

      axios
        .get(`/enrolments/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.enrolment = response.data.data;
          console.log(this.enrolment);
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    deleteEnrolment() {
      if (this.lecturer.enrolments.length > 0) {
        //If course has enrolments
        this.$bvModal
          .msgBoxConfirm(
            "Please confirm that you want to delete the lecturer. WARNING: the enrolments for this lecturer will also be deleted!",
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
              this.lecturer.enrolments.forEach((enrolment) => {
                axios
                  .delete("/enrolments/" + enrolment.id, {
                    headers: { Authorization: "Bearer " + token },
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              });

              axios
                .delete(`/lecturers/${id}`, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then(() => {
                  this.$emit("lecturerDeleted");
                  this.$router.replace({ name: "lecturers_index" });
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
          .msgBoxConfirm(
            "Please confirm that you want to delete the lecturer.",
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
              axios
                .delete(`/lecturers/${id}`, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then(() => {
                  this.$emit("lecturerDeleted");
                  this.$router.replace({ name: "lecturers_index" });
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