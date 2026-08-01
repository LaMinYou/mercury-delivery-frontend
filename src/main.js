import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//mdi icons
import '@mdi/font/css/materialdesignicons.css'

// Vuetify imports
import 'vuetify/styles'           // global styles
import 'vuetify/lib/styles/main.sass'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'

// create Vuetify instance
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    // Custom green colors ကို Vuetify color Object မှ ညွှန်းပေးထားခြင်း
                    'green-darken-4': colors.green.darken4,
                    'green-lighten-5': colors.green.lighten5,
                    'green-lighten-4': colors.green.lighten4,
                },
            },
        },
    },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
