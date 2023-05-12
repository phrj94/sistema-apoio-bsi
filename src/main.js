import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { mdiEye, mdiEyeOff  } from '@mdi/js'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases: {
            ...aliases,
            eye: mdiEye,
            offEye: mdiEyeOff
        },
        sets: {
            mdi,
        }
    }
})

const app = createApp(App)

app.use(vuetify)
app.use(router)

app.mount('#app')
