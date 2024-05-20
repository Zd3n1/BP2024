<template>
  <v-row justify="space-around">
    <v-col cols="4">
      <v-form @submit.prevent="submitForm">
        <v-select
            v-model="selectedUsername"
            label="Username"
            :items="usernames"
        ></v-select>

        <v-text-field
            label="Bonus"
            type="number"
            v-model="bonus"
            :rules="bonusRules"
        ></v-text-field>

        <div class="align-container">
          <v-btn
              color="primary"
              @click="submitForm"
              :disabled="!isFormValid"
          >
            Add
          </v-btn>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapStores } from "pinia";
import { useUserStore } from "../stores/UserStore";

export default {
  name: "BonusForm",

  data() {
    return {
      selectedUsername: "",
      bonus: null,
      bonusRules: [
        v => !!v || "Bonus is required",
        v => v >= 0 || "Bonus must be a positive number"
      ]
    };
  },

  computed: {
    ...mapStores(useUserStore),

    filteredUsers() {
      return this.userStore.users.filter(user => user.role === "student");
    },

    usernames() {
      return this.filteredUsers.map(user => user.username);
    },
    isFormValid() {
      return this.selectedUsername && this.bonus !== null && this.bonus >= 0;
    }
  },

  created() {
    this.userStore.loadAll1();
  },

  methods: {
    submitForm() {
      if (this.isFormValid) {
        const user = this.userStore.users.find(user => user.username === this.selectedUsername);
        this.$emit("add-bonus", {
          user_id: user.user_id,
          bonus: this.bonus
        });
        console.log("Form submitted:", {
          user_id: user.user_id,
          bonus: this.bonus
        });
      } else {
        console.log("Form validation failed.");
      }
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

.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
