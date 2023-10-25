import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import VueAxios from 'vue-axios'
import axiosInstance from './http'
import Tailwind from "primevue/passthrough/tailwind";
import 'primeicons/primeicons.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axiosInstance)
app.use(PrimeVue, { unstyled: true, pt: Tailwind });

app.mount('#app')
