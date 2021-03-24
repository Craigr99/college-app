<template>
  <div>
    <!-- Top section -->
    <div class="mb-3">
      <b-row class="align-items-center">
        <b-col>
          <span class="d-flex">
            <h2 class="mr-2">Enrolments</h2>
            <b-button
              class="align-self-center"
              variant="outline-primary"
              size="sm"
            >
              <router-link :to="{ name: 'enrolments_create' }">
                Add Enrolment
              </router-link>
            </b-button>
          </span>
        </b-col>
        <b-col>
          <b-input-group>
            <b-form-input
              size="md"
              placeholder="Search for an enrolment.."
              v-model="term"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="md"
                variant="outline-primary"
                @click="searchEnrolment()"
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
      :items="filteredEnrolments"
      :fields="fields"
      head-variant="dark"
    >
      <template #cell(status)="data">
        <router-link
          :to="{ name: 'enrolments_show', params: { id: data.item.id } }"
        >
          {{ data.item.status }}
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
      <template #cell(course)="data">
        <router-link
          :to="{ name: 'courses_show', params: { id: data.item.course.id } }"
        >
          {{ data.item.course.title }}
        </router-link>
      </template>
      <template #cell(actions)="data">
        <router-link
          :to="{ name: 'enrolments_edit', params: { id: data.item.id } }"
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
  name: "EnrolmentIndex",
  components: {},
  data() {
    return {
      enrolments: [],
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
        {
          key: "course",
          label: "Course",
          sortable: true,
        },
        "Actions",
      ],
      term: "",
      filteredEnrolments: [],
    };
  },
  watch: {
    term: function () {
      this.searchEnrolment();
    },
  },
  mounted() {
    this.getEnrolments();
  },
  methods: {
    getEnrolments() {
      let token = localStorage.getItem("token");
      axios
        .get("/enrolments", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.data);
          this.enrolments = response.data.data;
          this.filteredEnrolments = this.enrolments;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
    searchEnrolment() {
      this.filteredEnrolments = this.enrolments.filter((enrolment) => {
        // Check enrolment date
        if (enrolment.date.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check enrolment time
        if (enrolment.time.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check enrolment status
        if (enrolment.status.toLowerCase().includes(this.term.toLowerCase())) {
          return true;
        }
        // Check enrolment lecturer
        if (
          enrolment.lecturer.name
            .toLowerCase()
            .includes(this.term.toLowerCase())
        ) {
          return true;
        }
        // Check enrolment course
        if (
          enrolment.course.title.toLowerCase().includes(this.term.toLowerCase())
        ) {
          return true;
        }
      });
    },
  },
};
</script>

<style></style>
