<template>
  <h1 class="d-flex align-center mb-4">
  Teacher
  </h1>
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
          User ID: {{ user.user_id }} | Score: {{ user.score }} | Bonus: {{ user.bonus }}
        </v-card-text>
        <v-progress-linear
            color="primary"
            height="20"
            :model-value= "user.score+user.bonus"

        ></v-progress-linear>
<!--        <v-progress-linear color="primary" :model-value= "user.score" :max="200"></v-progress-linear>-->

      </v-card>
    </v-col>
  </v-row>


</template>


<script>
import { mapStores } from "pinia";
import CourseForm from "../components/CourseForm.vue";
import Error from "../components/Error.vue";
import { useTeacherStore } from "../stores/TeacherStore";

export default {
  name: "TeacherView",

  components: {
    Error,
    CourseForm,
  },

  created() {
    this.teacherStore.loadAll();
  },

  computed: {
    ...mapStores(useTeacherStore),

    filteredUsers() {
      return this.teacherStore.users.filter(user => user.role === "student");
    },
  },

  methods: {
  },
};
</script>


<style scoped></style>
