<template>
  <div id="app">
    <Navbar v-if="$route.path !== '/auth'" />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/NavbarPage.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      loggedIn: false,
      userId: null,
    };
  },
  methods: {
    setLoggedIn(userId) {
      this.loggedIn = true;
      this.userId = userId;
      localStorage.setItem('loggedIn', 'true');
    },
  },
  provide() {
    return {
      loggedIn: this.loggedIn,
      userId: this.userId,
      setLoggedIn: this.setLoggedIn,
    };
  },
}
</script>
