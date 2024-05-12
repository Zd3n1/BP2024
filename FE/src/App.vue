<template>
  <v-app>
    <v-app-bar color="primary" >
      <v-app-bar-title>
        <router-link :to="{ name: 'home' }" class="router-link-reset">
        <v-icon class="mx-2"  >mdi-school</v-icon>
        3D Scholar
        </router-link>
      </v-app-bar-title>

      <v-btn :to="{ name: 'home' }">Home</v-btn>
      <v-btn :to="{ name: 'reservations' }">Reservations</v-btn>
      <v-btn :to="{ name: 'lesson' }">Lessons</v-btn>
<!--      <v-btn :to="{ name: 'courses' }">Courses</v-btn>-->
      <v-btn :to="{ name: 'leaderboard' }">Leaderboard</v-btn>
      <v-btn :to="{ name: 'teacher' }">Teacher</v-btn>
      <v-btn :to="{ name: 'admin' }">Admin</v-btn>

<!--      <v-btn :to="{ name: 'printer' }">Tiskárna</v-btn>-->

      <v-menu anchor="bottom end" v-model="userMenuShown">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-account-circle" v-bind="props" ></v-btn>
        </template>
        <v-list>
          <v-list-item v-if="!userStore.isAuthenticated" @click="login()">
            <v-list-item-title>Log in</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="userStore.isAuthenticated">
            <v-list-item-title class="pr-2">
              <v-chip  text>{{ userStore.user.username }}</v-chip>

            </v-list-item-title>

            <v-chip text>{{ userStore.user.role }}</v-chip>
<!--            <v-chip text>{{ userStore.user.id }}</v-chip>-->

<!--            <v-chip color="green" text>{{ userStore.user.role }}</v-chip>-->

<!--            <v-list-item-title class="pr-1">-->
<!--              <v-chip color="green" text>{{ userStore.user.role }}</v-chip>-->
<!--            </v-list-item-title-->
<!--            >-->
          </v-list-item>
          <v-list-item v-if="userStore.isAuthenticated" @click="logout()">
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>


      <v-btn icon="mdi-printer" :color="buttonColor" :to="{ name: 'printer' }"></v-btn>

<!--      "mdi-printer-3d"-->
<!--      doesnt ready represent the 3d printer icon, no one i show it to recognized it :D-->




        <v-btn icon="mdi-close-octagon-outline" color="red" @click="dialog = true"></v-btn>

        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5">Emergency Stop</v-card-title>
<!--            <v-card-text>Are you sure you want to perform an emergency stop?</v-card-text>-->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
              <v-btn
                  color="red darken-1"
                  text @click="sendEmergencyStop();
                  dialog= false">Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "./stores/UserStore";
import { mapStores } from "pinia/dist/pinia";
import axios from 'axios';
import config from "./config";


export default {
  name: "App",

  data() {
    return {
      userMenuShown: false,
      printerData: null,
      error: null,
      isLoading: false,
      // server: '192.168.0.178',
      // apiKey: '9D921B1F7A2448E59A10A17EB7834010',
      dialog: false,
    };
  },

  computed: {
    ...mapStores(useUserStore),
    buttonColor() {
      if (this.error) return 'red';
      if (!this.printerData) return 'grey';
      if (this.printerData.state.flags.error) return 'red';
      if (this.printerData.state.flags.printing) return 'yellow';
      if (this.printerData.state.flags.operational) return 'green';
      return 'grey';
    },
  },

  mounted() {
    this.fetchPrinterStatus();
    setInterval(this.fetchPrinterStatus, 15000);
  },

  methods: {
    async login() {
      // await this.UserStore.login('user', 'pw')
      this.$router.push({ name: "login" });
      this.userMenuShown = false;
    },
    async logout() {
      await this.userStore.logout();
      this.$router.push({ name: "login" });
      this.userMenuShown = false;
    },


    fetchPrinterStatus() {
      this.isLoading = true;
      this.error = null;
      const url = `http://${config.server}/api/printer`;
      const config1 = {
        headers: {
          'X-Api-Key': config.apiKey
        },
        timeout: 2000,
      };
      axios.get(url, config1)
          .then(response => {
            this.printerData = response.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.error = error.message;
            this.isLoading = false;
            console.error("Error fetching printer status:", error);
          });
    },



    sendEmergencyStop() {
      const url = `http://${config.server}/api/printer/command`;
      const config2 = {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': config.apiKey
        },
        timeout: 20000,
      };
      const data = {
        command: "M112"
      };

      axios.post(url, data, config2)
          .then(response => {
            console.log('Emergency stop sent successfully:', response);
          })
          .catch(error => {
            console.error('Error sending emergency stop:', error);
          });
    }
  }
};
</script>

<style scoped>
nav {
  margin-bottom: 1em;
}

.router-link-reset {
  color: inherit;
  text-decoration: none;
}

.router-link-reset:hover {
  text-decoration: none;
  color: inherit;
}
</style>
