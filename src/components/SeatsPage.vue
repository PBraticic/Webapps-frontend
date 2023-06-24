<template>
  <div class="container">
    <h1 class="title">Seat Selection</h1>
    <select v-model="selectedRoom" @change="fetchRoomInfo">
      <option v-for="room in rooms" :key="room" :value="room">Room {{ room }}</option>
    </select>
    <h2 v-if="film">{{ film }}</h2>
    <div v-if="userType === 'employee'">
      <input v-model="newFilm" type="text" placeholder="Enter film name">
      <button @click="setFilm">Set Film</button>
    </div>
    <div class="grid">
      <div v-for="seat in seats" :key="seat._id">
        <button
          class="btn seat"
          :class="seat.reserved ? 'btn-danger' : 'btn-success'"
          :disabled="seat.reserved && seat.userId?._id !== userId && userType !== 'employee'"
          @click="userType === 'employee' ? viewSeatInfo(seat) : reserveSeat(seat._id)"
        >
          Seat {{ seat.number }}
        </button>
        <div v-if="selectedSeat?._id === seat._id">
          <div>Reserved: {{ selectedSeat.reserved }}</div>
          <div v-if="selectedSeat.reserved">Reserved By: {{ selectedSeat.userId?.username }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seats: [],
      selectedSeat: null,
      rooms: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
      selectedRoom: 1, 
      film: '',
      newFilm: '',
      roomFilms: {}, 
    };
  },
  computed: {
    userType() {
      return localStorage.getItem('userType');
    },
    userId() {
      return localStorage.getItem('userId');
    },
  },
  created() {
    this.fetchRoomInfo();
    console.log('User type: ', this.userType);
  },
  methods: {
    viewSeatInfo(seat) {
      if (this.selectedSeat?._id === seat._id) {
        this.selectedSeat = null;
      } else {
        this.selectedSeat = seat;
      }
    },
    fetchRoomInfo() {
      Promise.all(this.rooms.map(room =>
        fetch(`http://localhost:3000/seat/${room}`, {
          credentials: 'include',
        })
          .then(response => response.json())
          .then(data => {
            this.roomFilms[room] = data.film;
            if (room == this.selectedRoom) { 
              this.seats = data.seats;
              this.film = data.film;
            }
          })
      )).then(() => {
        if (this.userType === 'user') {
          
          this.rooms = this.rooms.filter(room => this.roomFilms[room]);
          if (!this.roomFilms[this.selectedRoom]) { 
           
            this.selectedRoom = this.rooms[0];
            this.fetchRoomInfo(); 
          }
        }
      });
    },
    setFilm() {
      fetch(`http://localhost:3000/seat/${this.selectedRoom}/setFilm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ film: this.newFilm }),
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert(data.message);
          }
          this.film = this.newFilm;
        });
    },
    reserveSeat(seatId) {
      const userId = localStorage.getItem('userId');
      const seat = this.seats.find(seat => seat._id === seatId);
      const url = seat.reserved
        ? `http://localhost:3000/seat/unreserve/${seatId}`
        : `http://localhost:3000/seat/reserve/${seatId}`;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert(data.message);
          }
          this.fetchRoomInfo();
        });
    },
  },
};
</script>


<style scoped>
.container {
  padding: 2em;
}

.title {
  font-family: Arial, sans-serif;
  font-size: 1.5em;
  text-align: center;
  color: #000000;
  margin-bottom: 2em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  justify-items: center;
}

.seat {
  text-align: center;
  width: 100px;
  height: 50px;
  border-radius: 10px;
  font-size: 0.8em;
  cursor: pointer;
}
</style>
