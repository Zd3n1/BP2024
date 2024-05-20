<template>
  <h1 class="d-flex align-center mb-4">
    Admin
    <v-spacer />
    <v-btn color="primary" @click="showForm()">+ Add User</v-btn>
  </h1>
  <v-spacer />
  <UserForm
      v-if="userStore.isUserFormShown"
      @add="addUser"
  />
  <v-spacer />


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
    <v-col cols="3" v-for="user in filteredUsers" :key="user.user_id">
      <v-card>
        <v-card-header>
          <v-card-title>{{ user.username }}</v-card-title>
        </v-card-header>
        <v-card-text>
          Role: {{ user.role }}
          <div class="align-container">
            <!--              <v-btn class="margin-right" color="primary" @click="editUser(user)">Edit</v-btn>-->
            <v-btn color="error" @click="deleteUser(user.user_id)">Delete</v-btn>

          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>



</template>


<script>

import { mapStores } from "pinia/dist/pinia";
import Error from "../components/Error.vue";
import { useUserStore } from "../stores/UserStore";
import UserForm from "../components/UserForm.vue";
import {hoursToSeconds, minutesToSeconds} from "date-fns";

export default {
  name: "Admin",


  components: {
    Error,
    UserForm
  },

  created() {
    this.userStore.loadAll1();
    this.userStore.isUserFormShown = false;
  },

  computed: {
    ...mapStores(useUserStore),

    filteredUsers() {
      return this.userStore.users.filter(user => user.role === "student" || user.role === "teacher");
    },
  },

  methods: {
    loadUsers() {
      this.userStore.loadAll1();
    },

    async deleteUser(id) {
      try {
        const wasDeleted = await this.userStore.delete(id);
        if (wasDeleted) {
          await this.userStore.loadAll1();
          console.log("Data reloaded successfully.");
        } else {
          console.log("Deletion failed, no need to reload data.");
        }
      } catch (error) {
        console.error("Error during deletion or data reload:", error);
      }
    },
    showForm() {
      this.userStore.isUserFormShown = true;
    },
    hideForm() {
      this.userStore.isUserFormShown = false;
    },
    addUser(user) {
      this.userStore.create(user);
      this.userStore.isUserFormShown = false;
      this.userStore.loadAll1();







      // const duration = reservation.duration.split(":");
      // const durationInSeconds =
      //     hoursToSeconds(duration[0]) + minutesToSeconds(duration[1]);
      // const reservationFormatted = {
      //   ...reservation,
      //   duration: durationInSeconds,
      // };
      // this.reservationStore.create(reservationFormatted);
      // this.reservationStore.reservations.push(reservationFormatted);
      // this.reservationStore.isReservationFormShown = false;
    },
  },





};
</script>


<style scoped>
.align-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}


</style>