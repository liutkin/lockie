<script lang="ts" setup>
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useStore } from '@/store'
import usePassword from '@/composables/usePassword'
import BaseInput from "@/components/BaseInput.vue"

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
    <form @submit.prevent="createStore">
        <h1 class="text-2xl font-bold">
            {{ t('newStoreTitle') }}
        </h1>

        <div class="grid gap-y-8 my-8">
            <BaseInput
                v-model.trim="password"
                strength-indicator
                type="password"
                copyable
                visibility
                autofocus
                class="col-span-12"
            >
                {{ t('password') }}

                <template #suffix>
                    <button
                        type="button"
                        class="hover:text-primary flex cursor-pointer p-0 opacity-70 col-span-12"
                        tabindex="-1"
                        @click="generatePassword"
                    >
                        <mdicon name="dice-5-outline" :width="32" :height="18" />
                    </button>
                </template>
            </BaseInput>

            <BaseInput
                v-model.trim="passwordConfirmation"
                copyable
                visibility
                type="password"
                class="col-span-12"
            >
                {{ t('passwordConfirmation') }}
            </BaseInput>
        </div>

        <p class="text-red-500 dark:text-red-400 my-8 text-sm">{{ t('storePasswordInfo') }}</p>

        <div class="flex justify-between">
            <button type="button" class="btn btn--alt" @click="emit('cancel')">
                {{ t('cancel') }}
            </button>

            <button :disabled="!formValid" class="btn btn--primary">
                <span class="flex mr-2">
                    <mdicon name="database-plus-outline" :size="18" />
                </span>

                {{ t('create') }}
            </button>
        </div>
    </form>
</template>