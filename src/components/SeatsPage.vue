<template>
   
  <div class="container py-5">
    <h1 class="text-center mb-4 naslov fw-bold">Seat Selection</h1>
    <div class="mb-3">
      <label for="roomSelection" class="form-label">Select Room</label>
      <select id="roomSelection" class="form-select" v-model="selectedRoom" @change="fetchRoomInfo">
        <option v-for="room in rooms" :key="room" :value="room">Room {{ room }}</option>
      </select>
    </div>
    <h2 class=" mb-3" v-if="film">{{ film }}</h2>
    <h3 class="mb-3" v-if="dateTime">{{ formatDate(dateTime) }}</h3>
    <div v-if="userType === 'employee'" class="mb-4">
      <div class="input-group mb-3">
        <input v-model="newFilm" type="text" class="form-control" placeholder="Enter film name">
        <button @click="setFilm" class="btn btn-primary">Set Film</button>
      </div>
      <div class="input-group">
        <input v-model="newDateTime" type="datetime-local" class="form-control">
        <button @click="setDateTime" class="btn btn-primary">Set Date and Time</button>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-md-6 g-4">
      <div v-for="seat in seats" :key="seat._id" class="col">
        <button
          class="btn seat w-100"
          :class="seat.reserved ? 'btn-danger' : 'btn-success'"
          :disabled="seat.reserved && seat.userId?._id !== userId && userType !== 'employee'"
          @click="userType === 'employee' ? viewSeatInfo(seat) : reserveSeat(seat._id)"
        >
          Seat {{ seat.number }}
        </button>
        <div v-if="selectedSeat?._id === seat._id" class="mt-2">
          <div>Reserved: {{ selectedSeat.reserved }}</div>
          <div v-if="selectedSeat.reserved">
            Reserved By: {{ selectedSeat.userId?.username }}
            <button v-if="userType === 'employee'" class="btn btn-warning btn-sm" @click="unreserveSeatByEmployee(seat._id)">Remove Reservation</button>
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
      seats: [],
      selectedSeat: null,
      rooms: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
      selectedRoom: 1, 
      film: '',
      newFilm: '',
      roomFilms: {}, 
      newDateTime: '',
      dateTime: '',
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
    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
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
              this.dateTime = data.dateTime;  
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
        console.log(data.message);
      }
      this.newFilm = '';  
      this.fetchRoomInfo();
    })
    .catch(error => console.error(`Fetch Error =\n`, error));
},

setDateTime() {
  fetch(`http://localhost:3000/seat/${this.selectedRoom}/setDateTime`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dateTime: this.newDateTime }),
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        console.log(data.message);
      }
      this.newDateTime = '';  
      this.fetchRoomInfo();
    })
    .catch(error => console.error(`Fetch Error =\n`, error));
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
    unreserveSeatByEmployee(seatId) {
      const userId = localStorage.getItem('userId');
      fetch(`http://localhost:3000/seat/unreserveByEmployee/${seatId}`, {
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
  height: 50px;
  border-radius: .25rem;
  font-size: .8em;
  cursor: pointer;
}
.naslov {
font-size: 50px;
font-weight: 50;
text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
color: #7e5fbd;
font-family: 'Brush Script MT';
}
</style>
