import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//mdi icons
import '@mdi/font/css/materialdesignicons.css'

// Vuetify imports
import 'vuetify/styles'           // global styles
import 'vuetify/styles/main.css'
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
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    colors: {
                        primary: colors.green.darken4, // #1B5E20
                        secondary: colors.green.lighten5,
                    }
                }
            }
        }
    },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
