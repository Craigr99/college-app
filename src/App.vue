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
      <flash-message transitionIn="animated swing" class="flash-message" />

      <router-view
        :loggedIn="this.loggedIn"
        v-on:login="setLoggedIn"
        v-on:logout="setLoggedOut"
        v-on:register="setLoggedIn"
        v-on:courseCreated="courseCreated"
        v-on:courseUpdated="courseUpdated"
        v-on:courseDeleted="courseDeleted"
      />
    </b-container>
  </div>
</template>

<script>
import axios from "@/config/api";
import Navbar from "./components/Navbar";
import FlashMessage from "./components/FlashMessage.vue";
require("vue-flash-message/dist/vue-flash-message.min.css");

export default {
  name: "App",
  components: {
    Navbar,
  },
  created() {
    FlashMessage;
    this.checkIfLogged();
  },
  data() {
    return {
      loggedIn: false,

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

      this.flash("Logged in Successfully!", "success", {
        timeout: 3000,
      });
    },
    setLoggedOut() {
      this.loggedIn = false;
      this.flash("Logged out Successfully!", "error", {
        timeout: 3000,
      });
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
      this.flash("Course Created Successfully!", "success", {
        timeout: 3000,
      });
    },
    courseUpdated() {
      this.flash("Course Updated Successfully!", "info", {
        timeout: 3000,
      });
    },
    courseDeleted() {
      this.flash("Course Deleted Successfully!", "error", {
        timeout: 3000,
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;500&display=swap");

body {
  font-family: "Poppins", sans-serif;
  background-color: #f9fafb !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a:hover {
  text-decoration: none !important;
}

.flash-message {
  position: fixed;
  top: 20px;
  right: 20px;
  max-height: 400px;
  width: 360px;
  z-index: 10;
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
