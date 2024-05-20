<template>
  <h1 class="d-flex align-center mb-4">
    Teacher
    <v-spacer />
    <v-btn color="primary" @click="showForm()">+ Add Bonus</v-btn>
  </h1>
  <v-spacer />
  <BonusForm
      v-if="userStore.isBonusFormShown"
      @add-bonus="addBonus"
  />
  <v-spacer />

  <error v-if="teacherStore.error" :text="teacherStore.error" @hide="teacherStore.clearError"></error>

  <v-progress-circular
      v-if="teacherStore.isLoading"
      color="primary"
      indeterminate
      size="50"
      width="5"
      class="ma-5"
  />

  <div v-else-if="teacherStore.users.length === 0">
    No users available
  </div>

  <v-row v-else>
    <v-col cols="12" v-for="user in filteredUsers" :key="user.user_id">
      <v-card cols="8">
        <v-card-header>
          <v-card-title>{{ user.username }}</v-card-title>
        </v-card-header>
        <v-card-text>
          Score: {{ user.score }} | Bonus: {{ user.bonus }}
        </v-card-text>
        <v-progress-linear
            color="primary"
            height="20"
            :model-value="user.score + user.bonus"
        ></v-progress-linear>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapStores } from "pinia";
import Error from "../components/Error.vue";
import { useTeacherStore } from "../stores/TeacherStore";
import { useUserStore } from "../stores/UserStore";
import BonusForm from "../components/BonusForm.vue";

export default {
  name: "TeacherView",

  components: {
    Error,
    BonusForm,
  },

  created() {
    this.teacherStore.loadAll();
  },

  computed: {
    ...mapStores(useTeacherStore, useUserStore),

    filteredUsers() {
      return this.teacherStore.users.filter(user => user.role === "student");
    },
  },

  methods: {
    showForm() {
      this.userStore.isBonusFormShown = true;
    },
    hideForm() {
      this.userStore.isBonusFormShown = false;
    },
    addBonus({ user_id, bonus }) {
      this.userStore.addBonus(user_id, bonus);
      this.userStore.isBonusFormShown = false;
      this.teacherStore.loadAll();
    },
  }
};
</script>

<style scoped>
.custom-height {
  height: 80px;
}

.card {
  min-width: 80vw;
  margin: 10px;
}

.align-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
</style>
