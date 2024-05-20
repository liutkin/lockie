<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

const selectNextLocale = () => {
    const currentIndex = availableLocales.indexOf(locale.value)
    const nextLocale = availableLocales[currentIndex + 1] || availableLocales[0]

    locale.value = nextLocale
    window.localStorage.setItem('locale', nextLocale)
}
</script>

<template>
    <button
        type="button"
        class="border-none bg-none uppercase text-gray-400 hover:text-primary text-xs px-2 py-1"
        @click="selectNextLocale"
    >
        {{ locale }}
    </button>
</template>