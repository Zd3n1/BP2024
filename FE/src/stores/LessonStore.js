import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useLessonStore = defineStore("lesson", {
  state: () => ({
    lessons: [],
    // quizzes: [],
    isLoading: false,
    error: null,
    isReservationFormShown: false,
  }),

  actions: {
    async loadAll(){
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.backendUrl}/lesson`);
        this.lessons = response.data;
        console.log(this.lessons);
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download lessons!";
      }
    },

    async getQuizzes1(id) {
        try {
          this.isLoading = true;
            const response = await axios.get(`${config.backendUrl}/lesson/${id}/quiz1`);
            this.quizzes = response.data;
            console.log(this.quizzes);
            this.error = null;
            this.isLoading = false;
        } catch {
            this.error = "Cannot download quizzes!";
        }
    },

    async getQuizzes(id) {
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.backendUrl}/lesson/${id}/quiz`);
        this.quizzes = response;
        console.log(this.quizzes);
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download quizzes!";
      }
    },



    async create(data) {
      await axios.post(config.backendUrl + "/lesson", data);
    },

    clearError() {
      this.error = null;
    },
  },
});
