import { defineStore } from 'pinia';
import axios from 'axios';
import config from "../config";

export const usePrinterStore = defineStore({
  id: 'printer',
  state: () => ({
    printerData: null,
    isLoading: false,
    error: null,
  }),
  getters: {
    buttonColor: (state) => {
      if (!state.printerData) return 'grey';
      if (state.printerData.state.flags.error) return 'red';
      if (state.printerData.state.flags.printing) return 'yellow';
      if (state.printerData.state.flags.operational) return 'green';
      return 'grey'; // Default color in other cases
    }
  },
  actions: {
    fetchPrinterStatus() {
      this.isLoading = true;
      const config = {
        headers: { 'X-Api-Key': '9D921B1F7A2448E59A10A17EB7834010' }
      };
      axios.get('http://192.168.0.178/api/printer', config)
          .then(response => {
            this.printerData = response.data;
            this.error = null;
          })
          .catch(error => {
            this.error = error.message;
          })
          .finally(() => {
            this.isLoading = false;
          });
    }
  }
});
