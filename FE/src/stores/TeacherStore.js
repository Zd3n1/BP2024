import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useTeacherStore = defineStore("teacher", {
  state: () => ({
    users: [],
    isLoading: false,
    error: null,
    isReservationFormShown: false,
  }),

  actions: {
    async loadAll(){
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.backendUrl}/teacher`);
        this.users = response.data;
        console.log(this.users);
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download users!";
      }
    },

    // async create(data) {
    //   await axios.post(config.backendUrl + "/course", data);
    // },

    clearError() {
      this.error = null;
    },
  },
});
