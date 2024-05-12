<template>
  <h1 class="d-flex align-center mb-4">
    Lessons
    <v-spacer />
  </h1>
  <v-spacer />

  <error v-if="lessonStore.error" :text="lessonStore.error" @hide="lessonStore.clearError"></error>

  <v-progress-circular
      v-if="lessonStore.isLoading"
      color="primary"
      indeterminate
      size="50"
      width="5"
      class="ma-5"
  />

  <div v-else-if="lessonStore.lessons.length === 0">
    No lessons available
  </div>

  <v-row v-else>
    <v-col cols="6" v-for="lesson in lessonStore.lessons" :key="lesson.id">
<!--      <v-card @click="navigatateToQuiz(lesson.id)">-->
<!--        <v-card :to="{name: `${lesson.id}/quiz`}">-->
      <v-card :to="{ name: 'quiz', params: { id: lesson.id } }">

      <!--          style="height: 20vh"-->

        <v-card-header>
          <v-card-title>{{ lesson.title }}</v-card-title>
        </v-card-header>
        <v-card-text>{{ lesson.text }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>

import { mapStores } from "pinia";
import { useLessonStore } from "../stores/LessonStore";
import Error from "../components/Error.vue";

export default {
  name: "LessonsView",

  components: {
    Error,
  },

  created() {
    this.lessonStore.loadAll();
  },

  computed: {
    ...mapStores(useLessonStore),
  },

  methods: {
    // navigateToQuiz(id) {
    //   this.$router.push(`${id}/quiz/`);
    // }

    // showForm() {
    //   this.courseStore.isReservationFormShown = true;
    // },
    // addCourse(courseData) {
    //   this.courseStore.create(courseData);
    //   this.courseStore.loadAll();
    // },
    // getImagePath(id) {
    //   return require(`../images/${id}.webp`);
    // }
  },
};
</script>


<style scoped>




</style>
