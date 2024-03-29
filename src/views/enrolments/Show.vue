<template>
  <div>
    <b-skeleton-wrapper :loading="loading">
      <!-- Loading skeleton card -->
      <template #loading>
        <b-card class="py-2">
          <span class="d-flex">
            <b-skeleton class="mr-2 mb-3" width="10%"></b-skeleton>
            <b-skeleton width="10%"></b-skeleton>
          </span>
          <b-skeleton width="30%"></b-skeleton>
          <b-skeleton class="my-3" width="50%"></b-skeleton>
          <b-skeleton width="30%"></b-skeleton>
          <div class="d-flex mt-3">
            <b-skeleton width="10%" type="button"></b-skeleton>
            <b-skeleton width="10%" type="button" class="mx-2"></b-skeleton>
            <b-skeleton width="10%" type="button"></b-skeleton>
          </div>
        </b-card>
      </template>

      <b-card
        header="Enrolment"
        header-text-variant="white"
        header-tag="header"
        header-bg-variant="dark"
        :sub-title="
          moment(enrolment.date).format('DD-MM-YYYY') +
          ' : ' +
          moment(enrolment.time, 'HH:mm:ss').format('HH:mm A')
        "
      >
        <b-card-text class="mt-3">
          <span class="d-flex align-items-baseline">
            <h5 class="mr-2">Lecturer:</h5>
            <router-link
              :to="{
                name: 'lecturers_show',
                params: { id: enrolment.lecturer_id },
              }"
            >
              {{ lecturer.name }}
            </router-link>
          </span>
          <span class="d-flex align-items-baseline my-3">
            <h5 class="mr-2">Course:</h5>
            <router-link
              :to="{
                name: 'courses_show',
                params: { id: enrolment.course_id },
              }"
            >
              {{ course.title }}
            </router-link>
          </span>
          <span class="d-flex align-items-baseline">
            <h5 class="mr-2">Status:</h5>
            {{ enrolment.status === "career_break" ? "Career Break" : "" }}
            {{ enrolment.status === "assigned" ? "Assigned" : "" }}
            {{ enrolment.status === "associate" ? "Associate" : "" }}
            {{ enrolment.status === "interested" ? "Interested" : "" }}
          </span>
        </b-card-text>

        <!-- Buttons -->
        <b-button href="#" variant="secondary">
          <router-link
            :to="{ name: 'enrolments_index' }"
            class="flex align-items-center text-white"
          >
            <b-icon-arrow-left></b-icon-arrow-left>
            <span class="ml-1"> back</span>
          </router-link>
        </b-button>

        <b-button href="#" variant="primary" class="mx-2">
          <router-link
            :to="{ name: 'enrolments_edit', params: { id: enrolment.id } }"
            class="text-white"
          >
            Edit
          </router-link>
        </b-button>
        <b-button href="#" variant="danger" @click="deleteEnrolment()"
          >Delete</b-button
        >
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
      course: [],
      lecturer: [],
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
          console.log(response.data.data);
          this.enrolment = response.data.data;
          this.lecturer = response.data.data.lecturer;
          this.course = response.data.data.course;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    deleteEnrolment() {
      this.$bvModal
        .msgBoxConfirm(
          "Please confirm that you want to delete the enrolment.",
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
            let id = this.enrolment.id;
            axios
              .delete(`/enrolments/${id}`, {
                headers: { Authorization: "Bearer " + token },
              })
              .then(() => {
                this.$emit("enrolmentDeleted");
                this.$router.replace({ name: "enrolments_index" });
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
    },
  },
};
</script>

<style>
h5 {
  margin-bottom: 0;
}
</style>