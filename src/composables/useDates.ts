import { ref, computed } from 'vue'
import { DateTime } from 'luxon'
import i18n from '@/i18n'

const localeFormattingTable = {
    en: 'en',
    ua: 'uk',
    ru: 'ru',
    default: 'en',
}

export default (initialDates = []) => {
    const dates = ref(
        initialDates.map((date) => ({
            milliseconds: null,
            relative: null,
            local: null,
            intervalId: null,
            ...date,
        }))
    )

    const existingDates = computed(() => dates.value.filter(({ milliseconds }) => milliseconds))

    const updateDate = (date) => {
        const formattingLocale =
            localeFormattingTable[i18n.global.locale.value] || localeFormattingTable.default
        date.relative = date.milliseconds
            ? DateTime.fromMillis(date.milliseconds).setLocale(formattingLocale).toRelative()
            : i18n.global.t('never')
        date.local = date.milliseconds ? new Date(date.milliseconds).toLocaleString() : null
    }

    const updateDates = () =>
        dates.value.forEach((date) => {
            updateDate(date)
            date.intervalId = setInterval(() => updateDate(date), 1000)
        })

    const stopUpdatingDates = () => {
        dates.value
            .filter(({ intervalId }) => intervalId)
            .forEach(({ intervalId }) => clearInterval(intervalId))
    }

    return {
        dates,
        existingDates,
        updateDates,
        stopUpdatingDates,
    }
}
