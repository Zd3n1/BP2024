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
      this.$emit("add", {
        ...this.reservation,
        user_id: this.userStore.user.id,
      });
    },
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
