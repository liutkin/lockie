import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import i18n from '@/i18n'
import { useStore } from '@/store'
import pinia from '@/pinia'

const store = useStore(pinia)
const { CREATE_RECORD } = store

export default () => {
    const newPasswordShown = ref(false)

    const create = (record) => {
        CREATE_RECORD(record)
        newPasswordShown.value = false
        notify({ type: 'success', text: i18n.global.t('added') })
    }

    return { newPasswordShown, create }
}
