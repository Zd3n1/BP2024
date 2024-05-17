<template>
  <v-row justify="space-around">
    <v-col cols="4">
      <v-form v-model="formValid" ref="form">
        <v-text-field
          label="Username"
          type="text"
          v-model="user.username"
        />
        <v-text-field
            label="Password"
            type="text"
            v-model="user.password"
        />
        <v-text-field
            label="Role"
            type="text"
            v-model="user.role"
        />




<!--        <v-text-field label="Description" v-model="reservation.description" />-->



        <div class="align-container">
          <v-btn color="primary" @click="onClick()">Add</v-btn>
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
  name: "UserForm",

  props: {
    text: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      formValid: true,
      user: {
        username: "",
        password: "",
        role: "",
      },
    };
  },

  computed: {
    ...mapStores(useUserStore),
  },

  methods: {

    onClick() {
      this.$emit("add", {
        ...this.user
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
