import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components: {
    ...components,
    VNumberInput, 
  },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0000FF', 
          secondary: '#0041C2',
          'green-darken-2': '#1976D2',
          'green-darken-3': '#1565C0',
          'green-darken-4': '#0000FF',
          'green-lighten-4': '#BBDEFB',
          'green-lighten-5': '#E3F2FD',
          'grey-darken-4': '#212121',
          'deep-sea-blue': '#123456'
        }
      }
    }
  }
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((reg) => {
        console.log('Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  });
}