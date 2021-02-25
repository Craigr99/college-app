<template>
  <div id="app">
    <Navbar @logging-out="loggingOut()" :loggedIn="loggedIn" />
    <b-container class="mt-5">
      <router-view
        @logging-in="loggingIn()"
        @registering-user="registering()"
      />
    </b-container>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",
  components: {
    Navbar,
  },
  mounted() {
    this.checkIfLogged();
  },
  data() {
    return {
      loggedIn: false,
    };
  },
  methods: {
    checkIfLogged() {
      let token = localStorage.getItem("token");
      if (token) {
        this.loggedIn = true;
      }
    },
    loggingIn() {
      this.loggedIn = true;
    },
    loggingOut() {
      this.loggedIn = false;
    },
    registering() {
      this.loggedIn = true;
    },
  },
};
</script>

<style>
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
