import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [],
    isLoading: false,
    error: null,
    isReservationFormShown: false,
  }),

  actions: {
    async loadAll(){
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.backendUrl}/course`);
        this.courses = response.data;
        console.log(this.users);
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download courses!";
      }
    },

    async create(data) {
      await axios.post(config.backendUrl + "/course", data);
    },

    clearError() {
      this.error = null;
    },
  },
});
