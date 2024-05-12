import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useQuizzStore = defineStore("quizz", {
  state: () => ({
    quizzes: [],
    isLoading: false,
    error: null,
    isReservationFormShown: false,
  }),

  actions: {
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

     async getTitle(id){
        try {
            this.isLoading = true;
            const response = await axios.get(`${config.backendUrl}/lesson/${id}/title`);
            this.quizzes = response;
            console.log(this.quizzes);
            this.error = null;
            this.isLoading = false;
        } catch {
            this.error = "Cannot download quizzes!";
        }
    },

    clearError() {
      this.error = null;
    },



  },
});
