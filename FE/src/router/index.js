import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthSection from "../AuthSection.vue";
import LoginView from "../views/LoginView.vue";
import ReservationsView from "../views/ReservationsView.vue";
import { useUserStore } from "../stores/UserStore";
import CoursesView from "../views/CoursesView.vue";
import PrinterView from "../views/PrinterView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import AdminView from "../views/AdminView.vue";
import TeacherView from "../views/TeacherView.vue";
import * as path from "path";
import LessonsView from "../views/LessonsView.vue";
import LessonsDetailView from "../views/LessonsDetailView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [


    {
      path: "/login",
      name: "login",
      component: LoginView,
    },



    {
      path: "/auth",
      name: "auth",
      component: AuthSection,
      beforeEnter: checkAuthentication,
      children: [
        {
          path: "reservations",
          name: "reservations",
          component: ReservationsView,
        },
        {
          path: "/courses",
          name: "courses",
          component: CoursesView,
        },
        {
          path: "/admin",
          name: "admin",
          component: AdminView,
        },
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
        {
          path: "/lesson",
          name: "lesson",
          component: LessonsView,
        },

        {
          path: "/lesson/:id/quiz",
          name: "quiz",
          component: LessonsDetailView,
        },

        {
          path: "/printer",
          name: "printer",
          component: PrinterView,
        },

        {
          path: "/leaderboard",
          name: "leaderboard",
          component: LeaderboardView,
        },

        {
          path: "/teacher",
          name: "teacher",
          component: TeacherView,
        },
      ],
    },
  ],
});

function checkAuthentication(to, from, next) {
  const store = useUserStore();
  if (store.isAuthenticated) {
    next();
  } else {
    store.setLoginMessage(
      "Please, log in to access the private section of the web."
    );
    store.setAfterLoginRoute(to);
    next({ name: "login" });
  }
}

export default router;
