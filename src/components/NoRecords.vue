<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIcon from "@/components/BaseIcon.vue"

const { t } = useI18n()
</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <BaseIcon class="w-20 opacity-70" name="planet" />

        <div class="mt-2">{{ t('noRecords') }}</div>
    </div>
</template>