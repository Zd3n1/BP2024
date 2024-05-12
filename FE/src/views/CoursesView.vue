<template>
  <h1 class="d-flex align-center mb-4">
    Courses
    <v-spacer />
  </h1>
  <v-spacer />

  <error v-if="courseStore.error" :text="courseStore.error" @hide="courseStore.clearError"></error>

  <v-progress-circular
      v-if="courseStore.isLoading"
      color="primary"
      indeterminate
      size="50"
      width="5"
      class="ma-5"
  />

  <div v-else-if="courseStore.courses.length === 0">
    No courses available
  </div>

  <v-row v-else>
    <v-col cols="6" v-for="course in courseStore.courses" :key="course.id">
      <v-card>
<!--          style="height: 20vh"-->
        <v-card-header>
          <v-card-title>{{ course.title }}</v-card-title>
        </v-card-header>
<!--        <img :src="imagePath" class="img">-->
<!--        <img src={{course.img}} class="img">-->
<!--        <img :src="course.img" class="img">-->
        <img src="../images/PracticalIMG.webp" class="img">
<!--        <img src="../images/{{course.id}}.webp" class="img">-->
<!--        <img src="image" class="img">-->
<!--        <img :src="getImagePath(course.id)" class="img">-->

<!--        <v-card-text>-->
<!--         Image path: {{ course.img }}-->
<!--        </v-card-text>-->

        <v-card-text>{{ course.description }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
import { mapStores } from "pinia";
import { useCourseStore } from "../stores/CourseStore";
import CourseForm from "../components/CourseForm.vue";
import Error from "../components/Error.vue";

export default {
  name: "CoursesView",

  components: {
    Error,
    CourseForm,
  },

  created() {
    this.courseStore.loadAll();
  },

  computed: {
    ...mapStores(useCourseStore),
  },

  methods: {
    // showForm() {
    //   this.courseStore.isReservationFormShown = true;
    // },
    addCourse(courseData) {
      this.courseStore.create(courseData);
      this.courseStore.loadAll();
    },
    getImagePath(id) {
      return require(`../images/${id}.webp`);
    }
  },
};
</script>


<style scoped>
.img{
  width: 100%;
  object-fit: scale-down;
  /*transform: scaleY(-1);*/
}



</style>
