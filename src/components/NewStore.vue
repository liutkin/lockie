<script lang="ts" setup>
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useStore } from '@/store'
import { vTooltip } from 'floating-vue'
import usePassword from '@/composables/usePassword'
import BaseInput from "@/components/BaseInput.vue"
import BaseIcon from "@/components/BaseIcon.vue"

const { t } = useI18n()
const store = useStore()
const { SET_STORE } = store

const emit = defineEmits(['cancel'])

const { password, passwordConfirmation, generatePassword } = usePassword()

const formValid = computed(
    () =>
        password.value &&
        passwordConfirmation.value &&
        password.value === passwordConfirmation.value
)

const createStore = () => {
    if (!formValid.value) return

    SET_STORE(password.value, {
        created: Date.now(),
        exported: null,
        edited: null,
        records: [],
    })
    setTimeout(() => notify({ type: 'success', text: t('newStoreCreated') }), 1000)
}
</script>

<template>
    <form @submit.prevent="createStore" class="flex flex-col gap-y-8">
        <h1 class="text-2xl font-bold">
            {{ t('newStoreTitle') }}
        </h1>

        <div class="flex flex-col gap-y-8">
            <BaseInput
                v-model.trim="password"
                strength-indicator
                type="password"
                copyable
                visibility
                autofocus
            >
                {{ t('password') }}

                <template #suffix>
                    <button
                        type="button"
                        class="hover:text-primary flex cursor-pointer p-0 opacity-70 col-span-12"
                        tabindex="-1"
                        @click="generatePassword"
                    >
                        <BaseIcon class="w-4" name="bulb" v-tooltip="t('suggestStrongPassword')" />
                    </button>
                </template>
            </BaseInput>

            <BaseInput
                v-model.trim="passwordConfirmation"
                copyable
                visibility
                type="password"
            >
                {{ t('passwordConfirmation') }}
            </BaseInput>

            <p class="flex items-center text-amber-500 dark:text-amber-400 text-sm">
                <BaseIcon class="w-7 mr-4 shrink-0" name="alert-triangle" />

                {{ t('storePasswordInfo') }}
            </p>
        </div>

        <div class="flex justify-between mt-6">
            <button type="button" class="btn btn--alt" @click="emit('cancel')">{{ t('cancel') }}</button>

            <button :disabled="!formValid" class="btn btn--primary">{{ t('create') }}</button>
        </div>
    </form>
</template>