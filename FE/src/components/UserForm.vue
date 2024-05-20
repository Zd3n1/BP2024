<template>
  <v-row justify="space-around">
    <v-col cols="4">
      <v-form v-model="formValid" ref="form">
        <v-text-field
          label="Username"
          type="text"
          v-model="user.username"
        />
<!--        <v-text-field-->
<!--            label="Password"-->
<!--            type="text"-->
<!--            v-model="user.password"-->
<!--        />-->


        <v-select
            v-model="user.role"
            label="Role"
            :items="['student', 'teacher' , 'admin']"
        >
        </v-select>



        <v-form @submit.prevent="submitForm">
          <v-text-field
              label="Password"
              type="password"
              v-model="user.password"
              :rules="passwordRules"
          />
          <v-text-field
              label="Confirm Password"
              type="password"
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
          />
        </v-form>

        <div class="align-container">
          <v-btn
              color="primary"
              @click="onClick()"
              :disabled="!isFormValid">
            Add
          </v-btn>
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
      confirmPassword: "",
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 6) || "Password must be at least 6 characters"
      ],
      confirmPasswordRules: [
        v => !!v || "Confirm Password is required",
        v => this.passwordsMatch || "Passwords must match"
      ]
    };
  },

  computed: {
    ...mapStores(useUserStore),
    passwordsMatch() {
      return this.user.password === this.confirmPassword;
    },
    isFormValid() {
      return this.passwordsMatch && this.user.password && this.confirmPassword;
    }


  },

  methods: {

    submitForm() {
      if (this.isFormValid) {
        console.log("Form submitted:", this.user);
      } else {
        console.log("Form validation failed.");
      }
    },

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
