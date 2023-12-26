import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'
import i18n from '@/i18n'
import pinia from '@/pinia'
import App from '@/App.vue'
import '@/styles/index.css'

createApp(App)
    .use(pinia)
    .use(i18n)
    .use(Notifications)
    .use(mdiVue, { icons: mdijs })
    .mount('#app')
