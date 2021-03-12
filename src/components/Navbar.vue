<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-container>
        <b-navbar-brand>
          <router-link to="/" class="text-white">College App</router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav v-if="loggedIn">
            <b-nav-item>
              <router-link :to="{ name: 'courses_index' }" class="text-white"
                >Courses</router-link
              >
            </b-nav-item>
            <b-nav-item>
              <router-link :to="{ name: 'enrolments_index' }" class="text-white"
                >Enrolments</router-link
              >
            </b-nav-item>
            <b-nav-item>
              <router-link :to="{ name: 'lecturers_index' }" class="text-white"
                >Lecturers</router-link
              >
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!loggedIn">
              <router-link to="/login" class="text-white">Login</router-link>
            </b-nav-item>
            <b-nav-item v-if="!loggedIn">
              <router-link to="/register" class="text-white"
                >Register</router-link
              >
            </b-nav-item>

            <b-nav-item-dropdown right v-if="loggedIn">
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{ name }}</em>
              </template>
              <b-dropdown-item>
                <router-link :to="{ name: 'user_dashboard' }">
                  Dashboard
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    loggedIn: Boolean,
    name: String,
  },
  data() {
    return {};
  },
  methods: {
    logout() {
      let token = localStorage.getItem("token");
      axios
        .get("https://craig-college-api.herokuapp.com/api/logout", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data);
          console.log("Logged out");
          this.$emit("logout");
          this.$router.push({ name: "login" });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });

      localStorage.removeItem("token");
    },
  },
};
</script>
