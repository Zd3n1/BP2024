<template>
  <h1 class="d-flex align-center mb-4">
    Reservations
    <v-spacer />
    <v-btn color="primary" @click="showForm()">+ Add Reservation</v-btn>
  </h1>
  <v-spacer />
  <ReservationForm
      v-if="reservationStore.isReservationFormShown"
      @add="addReservation"
  />
  <v-spacer />

  <error
      v-if="reservationStore.error"
      :text="reservationStore.error"
      @hide="reservationStore.clearError()"
  ></error>

  <v-progress-circular
      v-if="reservationStore.isLoading"
      color="primary"
      indeterminate
      size="50"
      width="5"
      class="ma-5"
  />

  <div v-else-if="reservationStore.reservations.length === 0">
    No reservations available
  </div>

  <v-row v-else>
    <v-col cols="12">
      <v-row>
        <v-radio-group
            v-model="order"
            row @input="handleRadioChange"
            color="primary">
          <v-radio label="Duration" value="duration"></v-radio>
          <v-radio label="Time" value="time"></v-radio>
        </v-radio-group>
      </v-row>

<!--      <v-row>-->
<!--        <v-col cols="12" md="4">-->
<!--          <v-select-->
<!--              v-model="order"-->
<!--              :items="selectItems"-->
<!--              label="Order By"-->
<!--              color="primary"-->
<!--              @change="handleSelectChange"-->
<!--          ></v-select>-->
<!--        </v-col>-->
<!--      </v-row>-->

      <v-row>
        <v-col
            cols="4"
            v-for="reservation in reservationStore.reservations"
            :key="reservation.id"
        >
          <v-card>
            <v-card-header>
              <v-card-header-text>
                <v-card-title>
                  Reservation
                  <br>
                  {{ format(new Date(reservation.time), "d.MM.yyyy") }}
                  {{ format(new Date(reservation.time), "HH:mm") }}
                </v-card-title>
              </v-card-header-text>
            </v-card-header>

            <v-card-text>
              {{ reservation.date }}
              <br>
              User: {{ reservation.username }}
              <br>
              Duration: {{ formatDuration(intervalToDuration({start: new Date(0), end: new Date(reservation.duration * 1000)})) }}
              <br>
              {{ reservation.description.length > 30 ? reservation.description.substr(0, 30) + "..." : reservation.description }}
<!--              Password: {{reservation.octo_pw}}-->
            </v-card-text>

<!--            <div v-if="reservationStore.isEditing && reservationStore.editingReservationId === reservation.id">-->
<!--              <v-btn color="primary" @click="updateReservation(reservation)">Save</v-btn>-->
<!--              <v-btn color="error" @click="cancelEdit">Cancel</v-btn>-->
<!--            </div>-->

            <div class="align-container">
<!--              <v-btn class="margin-right" color="primary" @click="editReservation(reservation)">Edit</v-btn>-->

              <v-btn
                  color="error"
                  @click="deleteReservation(reservation.reservation_id)"
                  :disabled="reservation.user_id !== userStore.user.id &&
                  (userStore.user.role !== 'admin' && userStore.user.role !== 'teacher')"
              >

                Delete
              </v-btn>

<!--              <v-btn color="error" @click="dialog = true">Delete</v-btn>-->
            </div>

<!--            <v-dialog v-model="dialog" persistent max-width="290">-->
<!--              <v-card>-->
<!--                <v-card-title class="text-h5">Delete confirmation</v-card-title>-->
<!--                <v-card-actions>-->
<!--                  <v-spacer></v-spacer>-->
<!--                  <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>-->
<!--                  <v-btn-->
<!--                      color="red darken-1"-->
<!--                      text @click="deleteReservation(reservation.reservation_id); dialog= false">Confirm-->
<!--                  </v-btn>-->
<!--                </v-card-actions>-->
<!--              </v-card>-->
<!--            </v-dialog>-->

<!--            weird behavior of popup window-->



          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useReservationStore } from "../stores/ReservationStore";
import { useUserStore } from "../stores/UserStore";
import ReservationForm from "../components/ReservationForm.vue";
import Error from "../components/Error.vue";
import {
  hoursToSeconds,
  minutesToSeconds,
  format,
  formatDuration,
  intervalToDuration,
} from "date-fns";


export default {
  name: "Reservations",
  components: {
    Error,
    ReservationForm,
  },
  data() {
    return {
      order: "time",
      // selectItems: [
      //   { text: "Time", value: "time" },
      //   { text: "Duration", value: "duration" }
      // ],
      format,
      formatDuration,
      intervalToDuration,
    };
  },
  created() {
    this.reservationStore.loadAll();
    this.reservationStore.isReservationFormShown = false;
  },
  computed: {
    ...mapStores(useUserStore, useReservationStore),
  },
  methods: {
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

      // if (this.reservationStore.checkTimeConflict(reservationFormatted)) {
      //   this.reservationStore.error = 'The selected time is already taken.';
      //   return;
      // }


      this.reservationStore.create(reservationFormatted);
      this.reservationStore.reservations.push(reservationFormatted);
      this.reservationStore.isReservationFormShown = false;
      this.reservationStore.loadAll();
    },
    // deleteReservation(id){
    //   this.reservationStore.delete(id);
    //   this.reservationStore.loadAll();
    // },



    async deleteReservation(id) {
      try {
        const wasDeleted = await this.reservationStore.delete(id);
        if (wasDeleted) {
          await this.reservationStore.loadAll();
          console.log("Data reloaded successfully.");
        } else {
          console.log("Deletion failed, no need to reload data.");
        }
      } catch (error) {
        console.error("Error during deletion or data reload:", error);
      }
    },

    // checkTimeConflict(newReservation) {
    //   const newStartTime = new Date(newReservation.time);
    //   const newEndTime = new Date(newStartTime.getTime() + newReservation.duration * 1000);
    //
    //   return this.reservations.some(reservation => {
    //     const startTime = new Date(reservation.time);
    //     const endTime = new Date(startTime.getTime() + reservation.duration * 1000);
    //     return (newStartTime < endTime && newEndTime > startTime);
    //   });
    // },

    handleRadioChange(event) {
      this.reservationStore.isLoading = true;
      this.reservationStore.loadAll(event.target.value);
      this.reservationStore.isLoading = false;
    },
    // not currently used, could delete this method






    // async activateOctoPrintUser(username) {
    //   const url = `http://${config.server}/api/users/${username}`;
    //   const config1 = {
    //     headers: {
    //       'X-Api-Key': config.apiKey,
    //       'Content-Type': 'application/json'
    //     }
    //   };
    //   const data = { active: true };
    //
    //   try {
    //     const response = await axios.patch(url, data, config1);
    //     return response.data;
    //   } catch (error) {
    //     console.error('Error activating OctoPrint user:', error);
    //     throw new Error('Failed to activate user');
    //   }
    // },
    //
    // async deactivateOctoPrintUser(username) {
    //   const url = `http://${config.server}/api/users/${username}`;
    //   const config1 = {
    //     headers: {
    //       'X-Api-Key': config.apiKey,
    //       'Content-Type': 'application/json'
    //     }
    //   };
    //   const data = { active: false };
    //
    //   try {
    //     const response = await axios.patch(url, data, config1);
    //     return response.data;
    //   } catch (error) {
    //     console.error('Error deactivating OctoPrint user:', error);
    //     throw new Error('Failed to deactivate user');
    //   }
    // },


  }
};
</script>

<style scoped>
.align-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}


.margin-right {
  margin-right: 16px;
}

</style>
