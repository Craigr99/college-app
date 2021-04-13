<template>
  <div>
    <!-- Top section -->
    <div class="mb-3">
      <b-row class="align-items-center">
        <b-col>
          <span class="d-flex">
            <h2 class="mr-2">Lecturers</h2>
            <b-button
              class="align-self-center"
              variant="outline-primary"
              size="sm"
            >
              <router-link :to="{ name: 'lecturers_create' }">
                Add Lecturer
              </router-link>
            </b-button>
          </span>
        </b-col>
        <b-col>
          <b-input-group>
            <b-form-input
              size="md"
              placeholder="Search for a lecturer.."
              v-model="term"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="md"
                variant="outline-primary"
                @click="searchLecturer()"
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
      :items="filteredLecturers"
      :fields="fields"
      head-variant="dark"
    >
      <template #cell(name)="data">
        <router-link
          :to="{ name: 'lecturers_show', params: { id: data.item.id } }"
        >
          {{ data.item.name }}
        </router-link>
      </template>
      <template #cell(actions)="data">
        <router-link
          :to="{ name: 'lecturers_show', params: { id: data.item.id } }"
        >
          <b-button size="sm" variant="outline-primary"
            ><b-icon-eye
          /></b-button>
        </router-link>
        <router-link
          :to="{ name: 'lecturers_edit', params: { id: data.item.id } }"
        >
          <b-button
            size="sm"
            variant="outline-primary"
            class="mx-md-2 my-2 my-md-0"
            ><b-icon-pen
          /></b-button>
        </router-link>
        <b-button
          size="sm"
          variant="outline-danger"
          @click="deleteLecturer(data.item.id)"
          ><b-icon-trash
        /></b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "@/config/api";

export default {
  name: "LecturerIndex",
  components: {},
  data() {
    return {
      lecturers: [],
      loading: true,
      fields: [
        {
          key: "name",
          sortable: true,
        },
        {
          key: "email",
          sortable: true,
        },
        {
          key: "phone",
          sortable: true,
        },
        {
          key: "address",
          sortable: true,
        },
        "Actions",
      ],
      term: "",
      filteredLecturers: [],
    };
  },
  watch: {
    term: function () {
      this.searchLecturer();
    },
  },
  mounted() {
    this.getLecturers();
  },
  methods: {
    getLecturers() {
      let token = localStorage.getItem("token");
      axios
        .get("/lecturers", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.lecturers = response.data.data;
          this.filteredLecturers = this.lecturers;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    getLecturer(id) {
      let token = localStorage.getItem("token");

      axios
        .get(`/lecturers/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.lecturer = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchLecturer() {
      this.filteredLecturers = this.lecturers.filter((lecturer) => {
        // Check lecturer name
        if (lecturer.name.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check lecturer email
        if (lecturer.email.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check lecturer address
        if (lecturer.address.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check lecturer phone
        if (lecturer.phone.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
      });
    },
    deleteLecturer(id) {
      this.getLecturer(id);

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
                  this.getLecturers();
                })
                .catch((error) => {
                  console.log(error);
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
              axios
                .delete(`/lecturers/${id}`, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then(() => {
                  this.$emit("lecturerDeleted");
                  this.getLecturers();
                })
                .catch((error) => {
                  console.log(error);
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
