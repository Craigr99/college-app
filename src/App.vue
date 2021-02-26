<template>
  <div id="app">
    <Navbar
      :token="token"
      v-on:login="setLoggedIn"
      v-on:logout="setLoggedOut"
      :loggedIn="this.loggedIn"
    />
    <b-container class="mt-5">
      <router-view
        :loggedIn="this.loggedIn"
        v-on:login="setLoggedIn"
        v-on:logout="setLoggedOut"
        v-on:register="setLoggedIn"
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
      token: "",
    };
  },
  methods: {
    checkIfLogged() {
      let token = localStorage.getItem("token");
      if (token) {
        this.loggedIn = true;
      }
    },
    setLoggedIn() {
      this.loggedIn = true;
      this.token = localStorage.getItem("token");
    },
    setLoggedOut() {
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
