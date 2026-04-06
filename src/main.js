import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//mdi icons
import '@mdi/font/css/materialdesignicons.css'

// Vuetify imports
import 'vuetify/styles'           // global styles
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// create Vuetify instance
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
