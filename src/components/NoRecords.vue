<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import SearchIcon from '@/icons/search.svg'

const { t } = useI18n()
</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <SearchIcon class="w-16 opacity-70 mb-2 fill-current" /> {{ t('noRecords') }}
    </div>
</template>