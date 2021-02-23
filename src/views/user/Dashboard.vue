<template>
  <div>
    <h1>Welcome home {{ user.name }}</h1>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserDashboard",
  data() {
    return {
      user: [],
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      let token = localStorage.getItem("token");
      axios
        .get("https://craig-college-api.herokuapp.com/api/user", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.user);
          this.user = response.data.user;
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
  },
};
</script>

<style>
</style>