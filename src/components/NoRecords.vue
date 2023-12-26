<template>
    <div class="flex flex-col justify-center items-center">
        <search-icon class="w-16 opacity-70 mb-2 fill-current" /> {{ t('noRecords') }}
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SearchIcon from '@/icon/search.svg'

const { t } = useI18n()
</script>
