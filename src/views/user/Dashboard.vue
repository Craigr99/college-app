<template>
  <div>
    <h1 class="mb-4">Welcome home {{ user.name }}</h1>
    <ImageLinks />
  </div>
</template>

<script>
import ImageLinks from "../../components/ImageLinks";
import axios from "@/config/api";

export default {
  name: "UserDashboard",
  components: {
    ImageLinks,
  },
  data() {
    return {
      user: [],
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      let token = localStorage.getItem("token");
      axios
        .get("/user", {
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