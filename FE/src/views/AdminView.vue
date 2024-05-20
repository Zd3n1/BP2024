<template>
  <h1 class="d-flex align-center mb-4">
    Admin
    <v-spacer />
    <v-btn color="primary" @click="showForm()">+ Add User</v-btn>
  </h1>
  <v-spacer />
  <UserForm v-if="userStore.isUserFormShown" @add="addUser" />
  <v-spacer />

  <error v-if="userStore.error" :text="userStore.error" @hide="userStore.clearError"></error>

  <v-progress-circular
      v-if="userStore.isLoading"
      color="primary"
      indeterminate
      size="50"
      width="5"
      class="ma-5"
  />

  <div v-else-if="userStore.users.length === 0">
    No users available
  </div>

  <v-row v-else>
    <v-col cols="3" v-for="user in filteredUsers" :key="user.user_id">
      <v-card>
        <v-card-header>
          <v-card-title>{{ user.username }}</v-card-title>
        </v-card-header>
        <v-card-text>
          Role: {{ user.role }}
          <div class="align-container">
            <v-btn
                color="error"
                @click="openDialog(user.user_id)"
                :disabled="user.user_id === userStore.user_id"
            >
              Delete
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5">Are you sure?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
<!--        <v-btn color="grey" @click="yeetUser1(yeetUser)">Delete reservations</v-btn>-->
        <v-btn
            color="red darken-1"
            @click="confirmDeleteUser"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapStores } from "pinia";
import Error from "../components/Error.vue";
import { useUserStore } from "../stores/UserStore";
import UserForm from "../components/UserForm.vue";
import { useReservationStore } from "../stores/ReservationStore";

export default {
  name: "Admin",
  data() {
    return {
      dialog: false,
      yeetUser: null,
    };
  },
  components: {
    Error,
    UserForm,
  },
  created() {
    this.userStore.loadAll1();
    this.userStore.isUserFormShown = false;
  },
  computed: {
    ...mapStores(useUserStore, useReservationStore),
    filteredUsers() {
      return this.userStore.users.filter(user => user.role === "student" || user.role === "teacher" || user.role === "admin");
    },
  },
  methods: {
    loadUsers() {
      this.userStore.loadAll1();
    },
    openDialog(userId) {
      this.yeetUser = userId;
      this.dialog = true;
    },
    async deleteUser(id) {
      try {
        const wasDeleted = await this.userStore.delete(id);
        if (wasDeleted) {
          await this.userStore.loadAll1();
          console.log("User deleted and data reloaded successfully.");
        } else {
          console.log("User deletion failed.");
        }
      } catch (error) {
        console.error("Error during deletion or data reload:", error);
      }
    },
    // async yeetUser1(id) {
    //   try {
    //     const wasYeeted = await this.reservationStore.deletedUser(id);
    //     if (wasYeeted) {
    //       console.log("User reservations deleted successfully.");
    //     } else {
    //       console.log("Failed to delete user reservations.");
    //     }
    //   } catch (error) {
    //     console.error("Error during deletion of user reservations:", error);
    //   }
    // },
    async confirmDeleteUser() {
      if (this.yeetUser !== null) {
        await this.deleteUser(this.yeetUser);
        // await this.yeetUser1(this.yeetUser);
        this.dialog = false;
        this.yeetUser = null;
      }
    },
    showForm() {
      this.userStore.isUserFormShown = true;
    },
    hideForm() {
      this.userStore.isUserFormShown = false;
    },
    async addUser(user) {
      await this.userStore.create(user);
      this.userStore.isUserFormShown = false;
      await this.userStore.loadAll1();
    },
  },
};
</script>

<style scoped>
.align-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}
</style>
