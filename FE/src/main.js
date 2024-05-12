import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// import VCalendar from 'v-calendar';
// import { VCalendar } from 'vuetify/labs/VCalendar'
// import { VCalendar } from 'vuetify/VCalendar'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
// import {VCalendar} from "vuetify/lib/labs/components";
// import { VCalendar } from 'vuetify/components';  //nefunguje

import { VCalendar } from 'vuetify/labs/VCalendar'
// import {VCalendar} from "vuetify/lib/labs/VCalendar";

loadFonts()

createApp(App)
    .use(router)
    .use(createPinia())
    .use(vuetify)
    .use(VCalendar)
    .component('v-calendar', VCalendar)
    .mount('#app')
