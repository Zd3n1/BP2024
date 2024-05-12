<template>
  <v-row justify="space-around">
    <v-col cols="4">
      <v-form v-model="formValid" ref="form">
        <v-text-field
          label="Time"
          type="datetime-local"
          v-model="reservation.time"
        />
        <v-text-field
          label="Duration"
          type="time"
          v-model="reservation.duration"
        />
        <v-text-field label="Description" v-model="reservation.description" />
        <v-btn color="primary" @click="onClick()">Add</v-btn>
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
        duration: 0,
        description: "",
      },
    };
  },

  computed: {
    ...mapStores(useUserStore),
  },

  methods: {
    onClick() {
      this.$emit("add", {
        ...this.reservation,
        user_id: this.userStore.user.id,
      });
    },
  },
};
</script>

<style></style>
