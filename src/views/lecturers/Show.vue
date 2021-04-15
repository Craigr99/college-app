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

      <b-card :title="lecturer.name" :sub-title="lecturer.email">
        <b-card-text>
          {{ lecturer.address }} <br />
          {{ lecturer.phone }}
        </b-card-text>

        <!-- Buttons -->
        <b-button href="#" variant="secondary">
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
        >
      </b-card>
    </b-skeleton-wrapper>

    <!-- Lecturer Enrolments -->
    <b-card class="mt-5">
      <div v-if="loading" class="d-flex align-items-center mt-5">
        <b-spinner label="Loading..." class="mx-auto"></b-spinner>
      </div>
      <div v-else>
        <span class="d-flex">
          <h4 class="mr-2">Lecturer Enrolments</h4>
          <b-button
            class="align-self-center"
            variant="outline-primary"
            size="sm"
            @click="newEnrolment(lecturer.id)"
          >
            Add Enrolment
          </b-button>
        </span>

        <b-table
          responsive
          striped
          hover
          :items="lecturer.enrolments"
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
          <template #cell(course)="data">
            <router-link
              :to="{
                name: 'courses_show',
                params: { id: data.item.course.id },
              }"
            >
              {{ data.item.course.title }}
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
                variant="outline-primary"
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
  name: "LecturerShow",
  data() {
    return {
      lecturer: [],
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
          key: "course",
          label: "Course",
          sortable: true,
        },
        "Actions",
      ],
    };
  },
  mounted() {
    this.getLecturer();
  },
  methods: {
    getLecturer() {
      let token = localStorage.getItem("token");
      let id = this.$route.params.id;

      axios
        .get(`/lecturers/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.lecturer = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    newEnrolment(id) {
      let data = {
        lecturerId: id,
      };
      this.$router.push({
        name: "enrolments_create",
        params: { data },
      });
    },

    deleteLecturer() {
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