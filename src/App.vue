<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
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
