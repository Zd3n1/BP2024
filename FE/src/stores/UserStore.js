import { defineStore } from 'pinia'
import axios from "axios";
import config from "../config";
import jwtDecode from "jwt-decode";

export const useUserStore = defineStore('user', {
  state() {
    const oldToken = localStorage.getItem('token');

    if (oldToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + oldToken;
    }

    return {
      token: oldToken,
      error: null,
      isLoggingIn: false,
      loginMessage: null,
      afterLoginRoute: null,
      users: [],
      isUserFormShown: false,
    }
  },

  getters: {
    isAuthenticated: state => state.token !== null,
    user: state => jwtDecode(state.token),
    user_id: state => jwtDecode(state.token).id,
  },

  actions: {
    async login(username, password) {
      try {
        this.isLoggingIn = true;

        const data = {username, password};
        const response = await axios.post(config.backendUrl + '/user/login', data);

        this.token = response.data.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
        localStorage.setItem('token', this.token);

        this.error = null;
        // this.isLoggingIn = false;        //mozna odkomentovat
        this.loginMessage = null;

      } catch (e) {
        console.error(e);
        this.error = 'Cannot log in!';
      }

      this.isLoggingIn = false;
    },

    setLoginMessage(message) {
      this.loginMessage = message;
    },

    logout() {
      this.token = null;
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    },

    clearError() {
      this.error = null;
    },

    getUserById(id) {
      return this.users.find(user => user.id === id);
    },

    async loadAll1(){
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.backendUrl}/user`);
        this.users = response.data;
        console.log(this.users);
        this.error = null;
        this.isLoading = false;
      } catch {
        this.error = "Cannot download users!";
      }
    },


    async addScore(user_id, score) {
      try {
        const response = await axios.post(`${config.backendUrl}/user/${user_id}/${score}`);
        console.log(response);
        return response.data;
      } catch (e) {
        console.error(e);
        this.error = 'Cannot add score!';
      }
    },


    async delete(id) {
      try {
        const response = await fetch(`${config.backendUrl}/user/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log("User deleted successfully");
          return true;
        } else {
          throw new Error('Failed to delete the user');
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        return false;
      }
    },

    async create(data) {
      await axios.post(config.backendUrl + "/user", data);
    },

  }
})
