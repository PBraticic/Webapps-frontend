<template>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <router-link to="/seats" class="text text-decoration-none">
            <h1 class="naslov fw-bold">SitCo</h1>
          </router-link>
          
          <h1 class="nav-link nav-item ml-5 mx-5 " v-if="!isEmployee">
      <router-link to="/MyProfile">MyProfile</router-link>
    </h1>
     
        </div>
        <div class="ml-auto d-flex align-items-center">
          <h1 v-if="isLoggedIn" @click="logout" class="btn btn-primary btn-lg">Logout</h1>
          <router-link v-else to="/auth" class="btn btn-primary btn-lg">
            <h1>Login</h1>
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NavbarPage',
    setup() {
      const router = useRouter();
    const isLoggedIn = computed(() => !!localStorage.getItem('loggedIn'))
    const isEmployee = computed(() => localStorage.getItem('userType') === 'employee')

  
      const logout = () => {
        fetch('http://localhost:3000/logout', {
          method: 'GET',
          credentials: 'include' 
        })
        .then(() => {
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('loginToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userType');
          router.push("/auth");
        })
      }
  
      return {
        isLoggedIn,
        logout,
        isEmployee
      }
    }
  }
  </script>
  


<style scoped>
.naslov {
font-size: 50px;
font-weight: 50;
text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
color: #ff0000;
font-family: 'Brush Script MT';
}
</style>
