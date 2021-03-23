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
          :to="{ name: 'lecturers_edit', params: { id: data.item.id } }"
        >
          <b-button size="sm" variant="outline-primary">Edit</b-button>
        </router-link>
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
      });
    },
  },
};
</script>

<style></style>
