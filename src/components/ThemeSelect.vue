<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { vTooltip } from 'floating-vue'
import BaseIcon from "@/components/BaseIcon.vue"

type Theme = {
    name: string
    icon: string
    title: string
}

const { t } = useI18n()

const initialTheme = window.localStorage.getItem('theme') || 'system'
const themes: Theme[] = [
    {
        name: 'system',
        icon: 'monitor',
        title: t('themeSystem'),
    },
    {
        name: 'light',
        icon: 'sun',
        title: t('themeLight'),
    },
    {
        name: 'dark',
        icon: 'moon',
        title: t('themeDark'),
    },
]
const name = ref(initialTheme)
const theme = computed(() => themes.find((theme) => theme.name === name.value) as Theme)

const updateThemeSelectorClass = () => {
    const darkModeActive = localStorage.theme === 'dark'
        || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        || (localStorage.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    darkModeActive
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark')
}

const selectNextTheme = () => {
    const currentIndex = themes.findIndex((theme: Theme) => theme.name === name.value)
    const nextTheme = themes[currentIndex + 1] || themes[0]

    name.value = nextTheme.name
    window.localStorage.setItem('theme', name.value)

    updateThemeSelectorClass()
}

updateThemeSelectorClass()
</script>

<template>
    <button
        :key="theme?.icon"
        type="button"
        class="animate-shaking border-none bg-none text-gray-400 hover:text-primary text-xs px-2 py-1"
        @click="selectNextTheme"
        v-tooltip="theme?.title"
    >
        <BaseIcon class="w-4" :name="theme?.icon" />
    </button>
</template>