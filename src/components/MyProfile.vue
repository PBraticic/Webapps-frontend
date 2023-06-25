<template>
  <div class="image"></div>
  <div class="reservation-section">
    <div v-if="!reservations.length" class="alert alert-info">
      <p>You have not reserved any seats yet.</p>
    </div>
    <div v-else>
      <h2 class="mb-4 custom-heading">Your Reservations</h2>
      <div class="row">
        <div v-for="reservation in reservations" :key="reservation._id" class="col-lg-4 col-md-6 col-sm-12 mb-4">
          <div class="card">
            <div class="card-img" :style="{ backgroundImage: `url(${require('@/assets/kartice.jpg')})` }"></div>
            <div class="card-body">
              <h5 class="card-title custom-font">Room: {{ reservation.room }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Seat: {{ reservation.number }}</h6>
              <p class="card-text">Film: {{ reservation.film }}</p>
              <p class="card-text">Time: {{ formatDate(reservation.dateTime) }}</p>
            </div>
          </div>
        </div>
      </div>
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
      fetch(`https://frontend-9jeh.onrender.com/user/reservations/${userId}`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Reservations data:', data);
          this.reservations = data.reservations;
        })
        .catch((error) => console.error(`Fetch Error =\n`, error));
    },

    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
  },
};
</script>

<style>
.alert {
  margin-top: 20px;
}



.card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 1rem;
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-img {
  height: 150px;
  background-size: cover;
  background-position: center;
  opacity: 0.7;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  font-size: 1em;
  color: #6c757d;
}

.card-text {
  margin-bottom: 0.5rem;
}

.custom-font {
  font-family: 'Open Sans', sans-serif;
  color: #7e5fbd;
}

.custom-heading {
  align-items: center;
  font-size: 80px;
  font-weight: 80;
  text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
  color: #ff0000;
  font-family: 'Brush Script MT';
}

.image {
  background-image: url(../assets/pozadina_sjedala.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
