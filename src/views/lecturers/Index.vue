<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Lecturers</h2>
      <b-button variant="outline-primary" size="sm">
        <router-link :to="{ name: 'lecturers_create' }">
          Add Lecturer
        </router-link>
      </b-button>
    </div>

    <div v-if="loading" class="d-flex align-items-center">
      <b-spinner label="Loading..." class="mx-auto"></b-spinner>
    </div>
    <b-table
      v-else
      responsive
      striped
      hover
      :items="lecturers"
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
    </b-table>
  </div>
</template>

<script>
import axios from "axios";

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
      ],
    };
  },
  mounted() {
    this.getLecturers();
  },
  methods: {
    getLecturers() {
      let token = localStorage.getItem("token");
      axios
        .get("https://craig-college-api.herokuapp.com/api/lecturers", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.lecturers = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
  },
};
</script>

<style></style>
