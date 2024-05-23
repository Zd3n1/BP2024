import { defineStore } from "pinia";
import axios from "axios";
import config from "../config";

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    reservations: [],
    isLoading: false,
    error: null,
    isReservationFormShown: false,
  }),

  actions: {

    async loadAll(order) {
      this.isLoading = true;
      try {
        const response = await axios.get(
            `${config.backendUrl}/reservation${order ? `?order=${order}` : ""}`
        );
        const reservations = response.data;
        const reservationPromises = reservations.map(async (reservation) => {
          try {
            const usernameResponse = await axios.get(`${config.backendUrl}/user/${reservation.user_id}/username`);
            return {...reservation, username: usernameResponse.data.username || "Unknown User"};
          } catch (error) {
            console.error("Error fetching username for user ID:", reservation.user_id, error);
            return {...reservation, username: "Unknown User"};
          }
        });

        this.reservations = await Promise.all(reservationPromises);
        this.error = null;
      } catch (error) {
        console.error("Failed to load reservations:", error);
        this.error = "Cannot download reservations!";
      }
      this.isLoading = false;
    },

    // async loadAll() {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.get(`${config.backendUrl}/reservation`);
    //     const reservations = response.data;
    //     const reservationPromises = reservations.map(async (reservation) => {
    //       try {
    //         const usernameResponse = await axios.get(`${config.backendUrl}/user/${reservation.user_id}/username`);
    //         return {...reservation, username: usernameResponse.data.username || "Unknown User"};
    //       } catch (error) {
    //         console.error("Error fetching username for user ID:", reservation.user_id, error);
    //         return {...reservation, username: "Unknown User"};
    //       }
    //     });
    //
    //     this.reservations = await Promise.all(reservationPromises);
    //     this.error = null;
    //   } catch (error) {
    //     console.error("Failed to load reservations:", error);
    //     this.error = "Cannot download reservations!";
    //   }
    //   this.isLoading = false;
    // },





    async loadUsername(id) {
      try {
        this.isLoading = true;
        const response = await axios.get(
            `${config.backendUrl}/users/${reservation.user_id}/username`
        );
        this.reservations = response.data;
        console.log(this.reservations);
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download reservations!";
      }
    },

    async getUsername(id) {
      try {
        const response = await axios.get(`${config.backendUrl}/users/${id}/username`);
        return response.data.username || "Unknown User" & response.data.role || "Unknown Role";
      } catch {
        return "Unknown User";
      }
    },

    async getRole(id) {
      try {
        const response = await axios.get(`${config.backendUrl}/users/${id}/role`);
        return response.data.role || "Unknown Role";
      } catch {
        return "Unknown User";
      }
    },

    async create(data) {
      await axios.post(config.backendUrl + "/reservation", data);
    },

    clearError() {
      this.error = null;
    },

    // async delete(id) {
    //   try {
    //     const response = await fetch(`${config.backendUrl}/reservation/${id}`, {
    //       method: 'DELETE'
    //     });
    //
    //     if (response.ok) {
    //       console.log("Reservation deleted successfully");
    //       return true;
    //     } else {
    //       throw new Error('Failed to delete the reservation');
    //     }
    //   } catch (error) {
    //     console.error("Error deleting reservation:", error);
    //     return false;
    //   }
    // },


    async delete(id) {
      try {

        const response = await fetch(`${config.backendUrl}/reservation/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete the reservation');
        }

        const response1 = await fetch(`${config.backendUrl}/reservation/yeetUser/${id}`, {
          method: 'DELETE'
        });

        if (!response1.ok) {
          throw new Error('Failed to delete the user\'s reservations');
        }

        console.log("Reservation and user's reservations deleted successfully");
        return true;
      } catch (error) {
        console.error("Error deleting reservation or user's reservations:", error);
        return false;
      }
    }
    },


  //   async deletedUser(id) {
  //   try {
  //     const response = await fetch(`${config.backendUrl}/reservation/yeetUser/${id}`, {
  //       method: 'DELETE'
  //     });
  //
  //     if (response.ok) {
  //       console.log("Users reservations deleted successfully");
  //       return true;
  //     }else {
  //       throw new Error('Failed to delete the users reservations');
  //     }
  //   } catch (error) {
  //     console.error("Error deleting users reservations:", error);
  //     return false;
  //   }
  //
  // },

  // async edit(id, data) {
  //   try {
  //     const response = await fetch(`${config.backendUrl}/reservation/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });
  //
  //     if (response.ok) {
  //       console.log("Reservation updated successfully");
  //       return true;
  //     } else {
  //       throw new Error('Failed to update the reservation');
  //     }
  //   } catch (error) {
  //     console.error("Error updating reservation:", error);
  //     return false;
  //   }
  // }

});
