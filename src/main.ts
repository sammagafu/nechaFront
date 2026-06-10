import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './assets/motion.css'
import './assets/storefront-theme.css'
import './assets/admin.css'
import { initTheme } from '@/stores/theme'

initTheme()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
