import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import vueDebounce from "vue-debounce";

const app = createApp(App)

app.use(router)
app.directive('debounce', vueDebounce())

app.mount('#app')
