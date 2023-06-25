<template>
  <div>
    <h1>My Profile</h1>
    <div v-if="!reservations.length">
      <p>You have not reserved any seats yet.</p>
    </div>
    <div v-else>
      <h2>Your Reservations</h2>
      <div v-for="reservation in reservations" :key="reservation._id">
        <p>Room: {{ reservation.room.room }}, Seat: {{ reservation.number }}, Film: {{ reservation.room.film }}, Time: {{ formatDate(reservation.dateTime) }}</p>
      </div>
    </div>
    <h2>Current Films in Each Room</h2>
    <div v-for="room in rooms" :key="room">
      <h3>Room {{ room }}</h3>
      <p>Film: {{ roomFilms[room] }}</p>
    </div>
  </div>
</template>


  <script>
  export default {
    data() {
      return {
        reservations: [],
      };
    },
    created() {
      this.fetchUserReservations();
    },
    methods: {
      fetchUserReservations() {
  const userId = localStorage.getItem('userId');
  fetch(`http://localhost:3000/user/reservations/${userId}`, {
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Reservations data:', data);
      this.reservations = data.reservations; 
    })
    .catch(error => console.error(`Fetch Error =\n`, error));
},

      formatDate(value) {
        const date = new Date(value);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      },
    },
  };
  </script>
  