<template>
  <div class="pozadina">
    <p style="font-size: 200px; text-align: center; font-family: 'Brush Script MT'; color: #6428bd; text-shadow: -4px 0 black, 0 10px black, 4px 0 black, 0 -4px black;">SitCo</p>

    <div class="form-box">
      <div class="button-box">
        <button type="button" class="toggle-btn login-btn fs-5 fw-bold" @click="showLogin">Log In</button>
        <button type="button" class="toggle-btn register-btn fs-5 fw-bold" @click="showRegister">Register</button>
      </div>

      
      
      <form v-if="isLogin" class="input-group" @submit.prevent="login">
        <input type="text " class="input-field fs-5 fw-bold" placeholder="Email" v-model="loginEmail" required>
        <input type="password" class="input-field fs-5 fw-bold" placeholder="Enter Password" v-model="loginPassword" required>
        <button type="submit" class="submit-btn">Login</button>
      </form>

        
    <form v-else class="input-group" @submit.prevent="register">
    <input type="text" class="input-field fs-5 fw-bold" placeholder="User Name " v-model="registerUsername" required>
    <input type="email" class="input-field fs-5 fw-bold" placeholder="Email" v-model="registerEmail" required>
    <input type="password" class="input-field fs-5 fw-bold" placeholder="Enter Password" v-model="registerPassword" required>
    <div>
        <input type="radio" id="user" value="user" v-model="userType">
        <label for="user" class="fs-5 fw-bold">User</label>
        <input type="radio" id="employee" value="employee" v-model="userType">
        <label for="employee" class="fs-5 fw-bold">Employee</label>
    </div>
    <br>
    <button type="submit" class="submit-btn">Register</button>
    </form>

    </div>
  </div>
</template>

<script>
export default {
  inject: ['setLoggedIn'], 
  data() {
    return {
      isLogin: true,
      loginEmail: '',
      loginPassword: '',
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      errorMessage: '',
      successMessage: '',
      userType: 'user',
    };
  },
  methods: {
    showLogin() {
      this.isLogin = true;
    },
    showRegister() {
      this.isLogin = false;
    },
    login() {
      fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.loginEmail,
          password: this.loginPassword,
        }),
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === "OK") {
            this.setLoggedIn(data._id); 
            this.$router.push('/seats');
            this.successMessage = 'Login successful!';
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userType', data.userType); 
            localStorage.setItem('userId', data.userId); 
          } else {
            alert ("Incorrect email or password")
            this.errorMessage = 'Invalid login credentials';
            console.log('Login failed with response: ', data);
          }
        })
        .catch(error => {
          this.errorMessage = 'Login error';
          console.error('Login error: ', error);
        });
    },
    async register() {
      if (!this.registerUsername || !this.registerEmail || !this.registerPassword || !this.userType) {
        alert('All fields must be filled');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.registerUsername,
            email: this.registerEmail,
            password: this.registerPassword,
            userType: this.userType, 
          }),
        });
        const data = await response.json();

        if (data.message === "Registration successful") {
          this.successMessage = 'Registration successful!';
          this.isLogin = true; 
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Registration error: ', error);
      }
    },
  },
};
</script>




<style scoped>
*{
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}
.pozadina{
    height: 100%;
    width: 100%;
    background-image: url(~@/assets/pozadina2.jpg);
    background-position: center;
    background-size: cover;
    position: absolute;
}
.form-box{
    width: 380px;
    height: 350px;
    position: relative;
    margin: 6% auto;
    background: rgba(130, 128, 246, 0.551);
    padding: 5px;
    overflow: hidden;
}
.button-box {
    width: 100%;
    display: flex; 
    justify-content: space-between; 
    padding: 0 20px; 
    box-shadow: 0 0 20px 9px #ef08081f;
    border-radius: 30px;
}

.toggle-btn {
    flex: 1; 
    margin-right: 10px; 
}

.login-btn {
    background: linear-gradient(to right, #ff105f, #ffad06);
    border-radius: 30px 0 0 30px;
}

.register-btn {
    background: linear-gradient(to right, #ffad06, #ff105f);
    border-radius: 0 30px 30px 0;
    margin-left: 10px; 
}
.toggle-btn{
    padding: 10px 30px;
    cursor: pointer;
    background: transparent;
    border: 0;
    outline: none;
    position: relative;
}
#btn{
    top: 0;
    left: 0;
    position: absolute;
    width: 110px;
    height: 100%;
    background: linear-gradient(to right, #ff105f, #ffad06);
    border-radius: 30px;
    transition: .5s;
}
.input-group{
    position: relative;  
    width: 280px;
    margin: 0 auto;  
    transition: .5s;
}
.input-field{
    width: 100%;
    padding: 10px 0;
    margin: 5px 0;
    border-left: 0;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid #9a9a9a;
    outline: none;
    background: transparent;
}
.submit-btn{
    width: 85%;
    padding: 10px 30px;
    cursor: pointer;
    display: block;
    margin: auto;
    background: linear-gradient(to right, #ff105f, #ffad06);
    border: 0;
    outline: none;
    border-radius: 30px;
}
.check-box{  
    margin: 30px 10px 30px 0;
}
span{
    color: #777;
    font-size: 12px;
    bottom: 68px;
    position: absolute;
}
#login{
    left: 50px;
}
#register{
    left: 450px;
}
.input-field::placeholder {
  color: #000000;
}
</style>
