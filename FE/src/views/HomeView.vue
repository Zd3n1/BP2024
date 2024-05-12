<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="v-calendar1" cols="7">
<!--        <v-col class="v-calendar1" cols="7" style="max-height: 80vh; overflow-y: auto;">-->
<!--        <v-col class="v-calendar1" cols="7">-->
          <v-calendar class="v-calendar2"
              :locale="cs-CZ"
              ref="calendar"
              v-model="value"
              :events="events"
              :type="type"
              :weekdays="weekday"
          >

          <template class="event" v-slot:event="{ event }">
            <div
                class="v-event-chip"
                :style="{ backgroundColor: event.color, color: textColor(event.color) }"
            >
              {{ event.title }}
              <br>
              {{ event.time}}
              <br>
              {{ event.text}}
<!--              <br>-->
<!--              {{event.role}}-->
            </div>
          </template>
          </v-calendar>

<!--          <v-col>-->
<!--            <div class="right-align-container">-->
<!--              <v-btn color="primary">+ Add Reservation</v-btn>-->
<!--            </div>-->
<!--          </v-col>-->



        </v-col>
        <v-col cols="5">
          <v-card :to="{name: 'printer'}">
            <v-card-title>
              Printer Status
            </v-card-title>

            <div class="center-div">
              <div>
                <v-btn icon="mdi-printer" :color="buttonColor"></v-btn>
                <v-spacer style="height: 2vh" ></v-spacer>
                <div v-if="isLoading">Loading...</div>
                <div v-if="error" style="color: red;">Error: {{ error }}</div>
                <div v-if="printerData" class="printer-status">


                  <h4>Printer State</h4>
                  <p>Status: {{ printerData.state.text }}</p>
<!--                  <div v-for="(value, key) in printerData.state.flags" :key="key">-->
<!--                    <p>{{ key }}: {{ value }}</p>-->
<!--                  </div>-->
                  <br>
                  <h4>Temperatures</h4>
                  <p>Bed: Actual: {{ printerData.temperature.bed.actual }}°C, Target: {{ printerData.temperature.bed.target }}°C</p>
                  <p>Tool: Actual: {{ printerData.temperature.tool0.actual }}°C, Target: {{ printerData.temperature.tool0.target }}°C</p>
                </div>
                <br>
<!--               <img src="http://192.168.0.178/webcam/?action=stream" class="img">-->
              </div>
            </div>
          </v-card>


          <v-card :to="{name: 'leaderboard'}" >
            <v-card-title>
              Leaderboard
            </v-card-title>

<!--            <v-select-->
<!--                v-model="sortType"-->
<!--                label="Sort by"-->
<!--                :items="['Total', 'Score', 'Bonus']">-->
<!--            </v-select>-->

            <error v-if="userStore.error" :text="userStore.error" @hide="userStore.clearError"></error>

            <v-progress-circular
                v-if="userStore.isLoading"
                color="primary"
                indeterminate
                size="50"
                width="5"
                class="ma-5"
            />

            <div v-else-if="userStore.users.length === 0">
              No users available
            </div>


            <v-row v-else>
              <v-col cols="12" v-for="user in sortedUsers" :key="user.user_id">
                <v-card>
                  <v-card-header>
                    <v-card-title>{{ user.username }}</v-card-title>
                  </v-card-header>
                  <v-progress-linear
                      v-if="sortType === 'Total'"
                      color="primary"
                      height="20"
                      :model-value="user.score + user.bonus"
                      :max="maxTotal">
                  </v-progress-linear>
                </v-card>
              </v-col>
            </v-row>


<!--            <div class="right-align-container">-->
<!--              <v-btn color="primary" :to="{ name: 'leaderboard' }">Leaderboard</v-btn>-->
<!--            </div>-->



          </v-card>

          <v-card :to="{name: 'lesson'}">
            <v-card-title>
              Lessons
              </v-card-title>

            <img src="../images/PracticalIMG.webp" class="img1">

            <v-card-text>
              Shows available lessons
              </v-card-text>

            </v-card>

<!--          <v-img src="../images/placeholder.png" aspect-ratio="16/9" class="mb-3">-->

<!--          </v-img>-->

        </v-col>
      </v-row>

<!--      <v-col cols="7">-->
<!--        <div class="align-container">-->
<!--&lt;!&ndash;          <v-btn color="primary">+ Add Reservation</v-btn>&ndash;&gt;-->
<!--          <v-btn color="primary" @click="showForm()">+ Add Reservation</v-btn>-->
<!--        </div>-->

<!--      </v-col>-->

<!--      <ReservationForm-->
<!--          v-if="reservationStore.isReservationFormShown"-->
<!--          @add="addReservation"-->
<!--      />-->

    </v-container>
  </div>



</template>

<script>
import placeholderIMG from '../images/placeholder.png'
import { useDate } from 'vuetify'
import { useReservationStore } from '../stores/ReservationStore';
import axios from "axios";
import config  from "../config";
import { useUserStore } from "../stores/UserStore";
import Error from "../components/Error.vue";
import CourseForm from "../components/CourseForm.vue";
import { mapStores } from "pinia/dist/pinia";
import ReservationForm from "../components/ReservationForm.vue";
import {
  hoursToSeconds,
  minutesToSeconds,
  format,
  formatDuration,
  intervalToDuration,
} from "date-fns";

export default {

  data: () => ({
    // currentLocale: 'cs-CZ',   //doesnt work
    type: 'month',
    types: ['month', 'week'],
    weekday: [1, 2, 3, 4, 5],
    value: [new Date()],
    events: [],
    colors: ['green', 'orange'],
    titles: ['Meeting', 'Party'],
    times: [],
    texts: [],
    roles: [],
    printerData: null,
    error: null,
    isLoading: false,
    sortType: 'Total',
    sortOptions: [
      { text: 'Total Score', value: 'Total' },
      { text: 'Score', value: 'Score' },
      { text: 'Bonus', value: 'Bonus' }
    ],
    roleColors: {

      admin: '#0046a0',
      teacher: '#97B2D8',
      student: '#E2E8F4',

    },
    order: "time",
    format,
    formatDuration,
    intervalToDuration,
  }),

    components: {
      Error,
      CourseForm,
      ReservationForm,
    },


  computed: {

    ...mapStores(useUserStore, useReservationStore),
    maxTotal() {
      return Math.max(...this.userStore.users.map(user => user.score + user.bonus));
    },

    sortedUsers() {
      let sorted;
      switch (this.sortType) {
        case 'Score':
          sorted= [...this.userStore.users].sort((a, b) => b.score - a.score);
          break;
        case 'Bonus':
          sorted = [...this.userStore.users].sort((a, b) => b.bonus - a.bonus);
          break;
        case 'Total':
        default:
          sorted = [...this.userStore.users].sort((a, b) => (b.score + b.bonus) - (a.score + a.bonus));
          break;
      }
      return sorted.slice(0, 3);
    },





    buttonColor() {
      if (this.error) return 'red';
      if (!this.printerData) return 'grey';
      if (this.printerData.state.flags.error) return 'red';
      if (this.printerData.state.flags.printing) return 'yellow';
      if (this.printerData.state.flags.operational) return 'green';
      return 'grey';
    }
  },

  methods: {
    changeLocale(locale) {
      this.currentLocale = locale;
    },

    showForm() {
      this.reservationStore.isReservationFormShown = true;
    },
    hideForm() {
      this.reservationStore.isReservationFormShown = false;
    },

    addReservation(reservation) {
      const duration = reservation.duration.split(":");
      const durationInSeconds =
          hoursToSeconds(duration[0]) + minutesToSeconds(duration[1]);
      const reservationFormatted = {
        ...reservation,
        duration: durationInSeconds,
      };
      this.reservationStore.create(reservationFormatted);
      this.reservationStore.reservations.push(reservationFormatted);
      this.reservationStore.isReservationFormShown = false;
    },

    loadUsers() {
      this.userStore.loadAll1();
    },

    // getEventsFromStore: function (title, start, end) {
    //   const reservationStore = useReservationStore();
    //   reservationStore.loadAll()
    //
    //   this.$watch(
    //       () => reservationStore.reservations,
    //       (newReservations) => {
    //         this.events = newReservations.map((reservation) => {
    //           const startTime = new Date(reservation.time);
    //           const endTime = new Date(startTime.getTime() + reservation.duration * 1000); //doesnt quite work
    //
    //           return {
    //             title: reservation.username,
    //             time: startTime.toTimeString().slice(0, 5) + "-" +
    //                 endTime.toTimeString().slice(0, 5),
    //             text: reservation.description,
    //             start: startTime,
    //             end: endTime,
    //             color: this.getEventColor(reservation),
    //             role: reservation.role
    //           };
    //         });
    //       },
    //       {immediate: true}
    //   );
    // },

    getEventsFromStore(title, start, end) {
      const reservationStore = useReservationStore();
      reservationStore.loadAll()

      this.$watch(
          () => reservationStore.reservations,
          (newReservations) => {
            this.events = newReservations.map((reservation) => {
              const startTime = new Date(reservation.time);
              const endTime = new Date(startTime.getTime() + reservation.duration * 1000);
              const user = this.userStore.users.find(u => u.user_id === reservation.user_id);

              return {
                title: reservation.username,
                time: startTime.toTimeString().slice(0,5) + "-" +
                    endTime.toTimeString().slice(0,5),
                text: reservation.description,
                start: startTime,
                end: endTime,
                color: user ? this.getEventColor(user.role) : '#CCCCCC',
                role: user ? user.role : 'unknown'
              };
            });
          },
          { immediate: true }
      );
    },

    getEventColor(role) {
      return this.roleColors[role] || '#CCCCCC';
    },


    // getEventColor (event) {
    //   return this.colors[Math.floor(Math.random() * this.colors.length)];
    // },

    textColor(color) {
      const rgb = parseInt(color.replace('#', ''), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >>  8) & 0xff;
      const b = (rgb >>  0) & 0xff;
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma < 128 ? 'white' : 'black';
    },

    fetchPrinterStatus() {
      this.isLoading = true;
      this.error = null;
      const url = `http://${config.server}/api/printer`;
      const config1 = {
        headers: {
          'X-Api-Key': config.apiKey
        },
        timeout: 2000
      };
      axios.get(url, config1)
          .then(response => {
            this.printerData = response.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.error = error.message;
            this.isLoading = false;
            console.error("Error fetching printer status:");
          });
    }
  },

  mounted () {
    this.fetchPrinterStatus();
    this.userStore.loadAll1();
    setInterval(this.fetchPrinterStatus, 15000);
    const adapter = useDate()
    this.getEventsFromStore(adapter.startOfDay(adapter.startOfMonth(new Date())), adapter.endOfDay(adapter.endOfMonth(new Date())));
  },
}
</script>

<style scoped>

.printer-status div {
  margin-bottom: 10px;
}

.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 45vh;*/
  text-align: center;
}

.v-event-chip {
  margin: 1px;
  padding: 0px 6px;
  padding-top: 1px;
  padding-bottom: 1px;
  border-radius: 4px;
  font-size: 0.875em;
  font-weight: 700;
}
.align-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  padding-top: 24px;
}

/*.event {*/
/*  height: 50%;*/
/*  transform-origin: top left;*/
/*}*/

/*.v-calendar {*/
/*  transform: scale(0.8);*/
/*  transform-origin: top left;*/
/*}*/

/*.v-calendar1 {*/
/*  height: 90vh;*/
/*  transform-origin: top left;*/
/*}*/

/*.v-calendar1{*/
/*  transform: scale(0.85);*/
/*  transform-origin: top left;*/
/*}*/

/*.v-calendar2 {*/
/*  height: 90vh;*/
/*  transform-origin: top left;*/
/*}*/
/*doesnt work breaks overlays bellow button onto calendar*/

/*.v-calendar1 {*/
/*  transform: scale(0.85);*/
/*  transform-origin: top left;*/
/*}*/


.v-calendar-daily__day-label {
  padding: 1px;
  margin: 0px;
}

.v-calendar-monthly__week {
  min-height: 10px;
}

.v-card {
  margin: 16px;
}

.img{
  width: 100%;
  object-fit: scale-down;
  transform: rotate(180deg);
  /*transform: scaleY(-1);*/
}

.img1{
  width: 100%;
  object-fit: scale-down;
  /*transform: rotate(180deg);*/
  /*transform: scaleY(-1);*/

}

</style>
