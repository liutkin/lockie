<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { handleBodyOverflow } from '@/utility'

const props = defineProps({
    modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const modalElement = ref(null)

onClickOutside(modalElement, () => emit('update:modelValue', false))
watchEffect(() => handleBodyOverflow(props.modelValue))
</script>

<template>
    <teleport to="body">
        <transition name="fade-zoom" mode="out-in">
            <div
                v-if="props.modelValue"
                class="fixed inset-0 z-30 bg-gradient-radial-dark flex justify-center items-center"
            >
                <div ref="modalElement" class="w-[40rem] max-w-[90vw] rounded overflow-hidden">
                    <slot name="content" />
                    <slot name="action" />
                </div>
            </div>
        </transition>
    </teleport>
</template>
