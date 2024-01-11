<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
})

const icon = defineAsyncComponent(() => import(`../icons/${ props.name }.svg`))
</script>

<template>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
        <Component :is="icon" />
    </svg>
</template>
