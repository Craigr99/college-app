<template>
  <div id="app">
    <Navbar
      :token="token"
      v-on:login="setLoggedIn"
      v-on:logout="setLoggedOut"
      :loggedIn="this.loggedIn"
      :name="this.user.name"
    />
    <b-container class="mt-5">
      <!-- Flash message  -->
      <FlashMessage
        :alertMessage="this.alertMessage"
        :dismissCountDown="this.dismissCountDown"
      />

      <router-view
        :loggedIn="this.loggedIn"
        v-on:login="setLoggedIn"
        v-on:logout="setLoggedOut"
        v-on:register="setLoggedIn"
        v-on:courseCreated="courseCreated"
      />
    </b-container>
  </div>
</template>

<script>
import axios from "@/config/api";
import Navbar from "./components/Navbar";
import FlashMessage from "@/components/FlashMessage.vue";

export default {
  name: "App",
  components: {
    Navbar,
    FlashMessage,
  },
  created() {
    this.checkIfLogged();
  },
  data() {
    return {
      loggedIn: false,
      token: "",
      alertMessage: "",
      dismissCountDown: 0,
      user: {
        name: "",
      },
    };
  },
  methods: {
    checkIfLogged() {
      let token = localStorage.getItem("token");
      if (token) {
        this.loggedIn = true;
        this.getUser();
      }
    },
    setLoggedIn() {
      this.loggedIn = true;
      this.token = localStorage.getItem("token");
      this.getUser();
    },
    setLoggedOut() {
      this.loggedIn = false;
    },
    getUser() {
      this.token = localStorage.getItem("token");

      axios
        .get("/user", {
          headers: { Authorization: "Bearer " + this.token },
        })
        .then((response) => {
          console.log(response.data.user);
          this.user.name = response.data.user.name;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    courseCreated() {
      this.alertMessage = " Success ";
      this.dismissCountDown = 3;
      console.log("course created");
      console.log(this.dismissCountDown);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;500&display=swap");

body {
  font-family: "Poppins", sans-serif;
  background-color: #f9fafb !important;
}

a:hover {
  text-decoration: none !important;
}

/* #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
