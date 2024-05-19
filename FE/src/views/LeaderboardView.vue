<template>
  <h1 class="d-flex align-center mb-4">
    Leaderboard
  </h1>

<!--  {{maxTotal}}, {{maxScore}}, {{maxBonus}}-->
  <v-spacer />

<!--  <v-select-->
<!--      v-model="sortType"-->
<!--      :items="sortOptions"-->
<!--      item-text="text"-->
<!--      item-value="value"-->
<!--      label="Sort by"-->
<!--      class="mb-4"-->
<!--  ></v-select>-->

   <v-select
       v-model="sortType"
     label="Sort by"
     :items="['Total', 'Score', 'Bonus']">
   </v-select>
<!--not ideal but works-->





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
<!--    <v-col cols="6" v-for="user in userStore.users" :key="user.user_id">-->
    <v-col cols="12" v-for="user in sortedUsers" :key="user.user_id">
      <v-card>
        <v-card-header>
          <v-card-title>{{ user.username }}</v-card-title>
        </v-card-header>
        <v-card-text>
          Total: {{ user.score + user.bonus }} | Score: {{ user.score }} | Bonus: {{ user.bonus }}
        </v-card-text>
        <v-progress-linear
            v-if="sortType === 'Total'"
            color="primary"
            height="20"
            :model-value="user.score + user.bonus"
            :max="maxTotal">
        </v-progress-linear>
        <v-progress-linear
            v-if="sortType === 'Score'"
            color="primary"
            height="20"
            :model-value="user.score"
            :max="maxScore">
        </v-progress-linear>
        <v-progress-linear
            v-if="sortType === 'Bonus'"
            color="primary"
            height="20"
            :model-value="user.bonus"
            :max="maxBonus">
        </v-progress-linear>
      </v-card>
    </v-col>
  </v-row>


</template>

<script>
import { mapStores } from "pinia";
import CourseForm from "../components/CourseForm.vue";
import Error from "../components/Error.vue";
import { useUserStore } from "../stores/UserStore";

export default {
  name: "LeaderboardView",

  data() {
    return {
      sortType: 'Total',
      sortOptions: [
        { text: 'Total Score', value: 'Total' },
        { text: 'Score', value: 'Score' },
        { text: 'Bonus', value: 'Bonus' }
      ],
    };
  },

  components: {
    Error,
    CourseForm,
  },

  created() {
    console.log(this.sortOptions);
    this.userStore.loadAll1();

  },

  computed: {
    ...mapStores(useUserStore),

    filteredUsers() {
      return this.userStore.users.filter(user => user.role === "student");
    },

    maxTotal() {
      return Math.max(...this.filteredUsers.map(user => user.score + user.bonus));
    },
    maxScore() {
      return Math.max(...this.filteredUsers.map(user => user.score));
    },
    maxBonus() {
      return Math.max(...this.filteredUsers.map(user => user.bonus));
    },

    sortedUsers() {
      switch (this.sortType) {
        case 'Score':
          return [...this.filteredUsers].sort((a, b) => b.score - a.score);
        case 'Bonus':
          return [...this.filteredUsers].sort((a, b) => b.bonus - a.bonus);
        case 'Total':
        default:
          return [...this.filteredUsers].sort((a, b) => (b.score + b.bonus) - (a.score + a.bonus));
      }
    }
  },

  methods: {
    loadUsers() {
      this.userStore.loadAll1();
    }
  },
};
</script>

<style scoped></style>