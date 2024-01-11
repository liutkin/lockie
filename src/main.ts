import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import Notifications from '@kyvg/vue3-notification'
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'
import i18n from '@/i18n'
import pinia from '@/pinia'
import App from '@/App.vue'
import 'floating-vue/dist/style.css'
import '@/styles/index.css'

FloatingVue.options.distance = 15
FloatingVue.options.themes.tooltip.triggers = ['hover']
FloatingVue.options.themes.tooltip.placement = 'bottom'

createApp(App)
    .use(pinia)
    .use(i18n)
    .use(Notifications)
    .use(mdiVue, { icons: mdijs })
    .mount('#app')
