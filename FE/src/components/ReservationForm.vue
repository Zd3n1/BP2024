<template>
  <v-row justify="space-around">
    <v-col cols="4">
      <v-form v-model="formValid" ref="form">
        <v-text-field
          label="Time"
          type="datetime-local"
          v-model="reservation.time"
        />

<!-- -->
<!--          <custom-time-picker @time-changed="handleTimeChange"></custom-time-picker>-->
<!--     -->



<!--        <v-text-field-->
<!--          label="Duration"-->
<!--          type="time"-->
<!--          v-model="reservation.duration"-->
<!--        />-->

<!--        <v-slider-->
<!--          label="Duration"-->
<!--          type="time"-->
<!--          min=0-->
<!--          max=960-->
<!--          step=30-->
<!--          v-model="reservation.duration"-->
<!--        />-->


        <v-slider
            label="Duration"
            v-model="sliderValue"
            color="primary"
            :min="0"
            :max="960"
            :step="30"
            thumb-label="always"
        />

        <div class="center-div">
          <v-text>
            {{ reservation.duration }} Hours
          </v-text>
        </div>

        <br>

        <v-text-field label="Description" v-model="reservation.description" />
        <div class="align-container">

          <v-btn
              color="primary"
              @click="onClick()"
          :disabled="!formValid"
          >Add</v-btn>
          <br>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapStores } from "pinia/dist/pinia";
import { useUserStore } from "../stores/UserStore";

export default {
  name: "ReservationForm",

  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formValid: true,
      reservation: {
        time: "",
        duration: "00:00",
        description: "",
        // octo_pw: ""
      },
      sliderValue: 0,
    };
  },
  computed: {
    ...mapStores(useUserStore),
    formattedDuration() {
      const hours = Math.floor(this.sliderValue / 60);
      const minutes = this.sliderValue % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    },

    // isFormValid() {
    //   return this.description.length > 0 && this.reservation.time.length > 0 && this.reservation.duration.length > 0;
    // },
  },

  watch: {
    sliderValue() {
      this.reservation.duration = this.formattedDuration;
    }
  },

  methods: {
    handleTimeChange(time) {
      this.reservation.time = time;
      console.log(`Selected time: ${this.reservation.time}`);
    },

    onClick() {

      // this.reservation.octo_pw = this.generateRandomPassword();
      // const username = this.userStore.user.username;
      //
      //   await this.createOctoPrintUser(username, this.reservation.octo_pw);

      this.$emit("add", {
        ...this.reservation,
        user_id: this.userStore.user.id,
      });
    },

    // async createOctoPrintUser(username, password) {
    //   const url = `http://${config.server}/api/users`;
    //   const config1 = {
    //     headers: {
    //       'X-Api-Key': config.apiKey,
    //       'Content-Type': 'application/json'
    //     }
    //   };
    //   const data = {
    //     username: username,
    //     password: password,
    //     active: false,
    //     roles: ['student']
    //   };
    //
    //   try {
    //     const response = await axios.post(url, data, config1);
    //     return response.data;
    //   } catch (error) {
    //     console.error('Error creating OctoPrint user:', error);
    //     throw new Error('Failed to create user');
    //   }
    // },
    // generateRandomPassword() {
    //   return Math.random().toString(36).slice(-8);
    // },



  },
};
</script>

<style>

.align-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}

.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 45vh;*/
  text-align: center;
}
</style>
