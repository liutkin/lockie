<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import exportStore from '@/utilities/exportStore'
import useNewPasswordCreation from '@/composables/useNewPasswordCreation'
import GithubLink from "@/components/GithubLink.vue"
import BaseInput from "@/components/BaseInput.vue"
import TheSettings from "@/components/TheSettings.vue"
import RecordEdit from "@/components/RecordEdit.vue"
import BaseIcon from "@/components/BaseIcon.vue"

const emit = defineEmits(['search'])

const { t } = useI18n()
const store = useStore()
const { STORE, RECORDS } = storeToRefs(store)
const { END_SESSION } = store
const { newPasswordShown, create } = useNewPasswordCreation()

const search = ref('')
const settingsShown = ref(false)

const emitSearch = () => emit('search', search.value)
const debouncedEmitSearch = debounce(emitSearch, 500)

watch(search, () => (search.value ? debouncedEmitSearch() : emitSearch()))
</script>

<template>
    <div>
        <div class="hidden lg:flex justify-between items-center">
            <div
                class="flex relative btn-indicator"
                :class="{ 'btn-indicator--active': newPasswordShown }"
            >
                <button
                    type="button"
                    class="btn btn--primary z-10"
                    @click="(settingsShown = false), (newPasswordShown = !newPasswordShown)"
                >
                    <BaseIcon class="w-4" name="file-plus" />

                    {{ t('newPassword') }}
                </button>
            </div>

            <div class="flex items-center">
                <GithubLink class="mr-12 xl:mr-6" />

                <div class="xl:hidden flex items-center">
                    <button
                        type="button"
                        class="flex justify-center items-center w-8 h-8 hover:text-primary mr-4"
                        @click="END_SESSION"
                    >
                        <BaseIcon class="w-4" name="power" />
                    </button>

                    <div
                        class="flex relative btn-indicator mr-8"
                        :class="{ 'btn-indicator--active text-primary': settingsShown }"
                    >
                        <button
                            type="button"
                            class="flex justify-center items-center w-8 h-8"
                            @click="(newPasswordShown = false), (settingsShown = !settingsShown)"
                        >
                            <BaseIcon class="w-4" name="gear" />
                        </button>
                    </div>
                </div>

                <div class="hidden xl:flex items-center">
                    <button type="button" class="btn btn--alt mr-2" @click="END_SESSION">
                        <BaseIcon class="w-4" name="power" />

                        {{ t('shutdown') }}
                    </button>

                    <div
                        class="flex relative btn-indicator mr-4"
                        :class="{ 'btn-indicator--active': settingsShown }"
                    >
                        <button
                            type="button"
                            class="btn btn--alt z-10"
                            @click="(newPasswordShown = false), (settingsShown = !settingsShown)"
                        >
                            <BaseIcon class="w-4" name="gear" />

                            {{ t('settings') }}
                        </button>
                    </div>
                </div>

                <BaseInput
                    v-model.trim="search"
                    autofocus
                    clearable
                    type="text"
                    class="w-60"
                    :placeholder="t('search')"
                    @clear="search = ''"
                >
                    <template #prefix>
                        <div class="opacity-70 flex">
                            <BaseIcon class="w-4 mx-3" name="search" />
                        </div>
                    </template>
                </BaseInput>

                <button
                    :disabled="!STORE || !RECORDS.length"
                    type="button"
                    class="btn btn--primary ml-4"
                    @click="exportStore"
                >
                    <BaseIcon class="w-4" name="export" />

                    {{ t('export') }}
                </button>
            </div>
        </div>

        <div>
            <Transition name="fade-zoom">
                <RecordEdit
                    v-if="newPasswordShown"
                    class="py-16 relative"
                    @cancel="newPasswordShown = false"
                    @create="create"
                />
            </transition>
        </div>

        <div class="overflow-hidden">
            <Transition name="fade-zoom">
                <div v-if="settingsShown" class="py-16">
                    <TheSettings @close="settingsShown = false" />
                </div>
            </transition>
        </div>

        <div class="lg:hidden px-4 pt-10 pb-6">
            <BaseInput
                v-model.trim="search"
                autofocus
                clearable
                type="text"
                :placeholder="t('search')"
                @clear="search = ''"
            >
                <template #prefix>
                    <div class="opacity-70 flex">
                        <BaseIcon class="w-4 mx-3" name="search" />
                    </div>
                </template>
            </BaseInput>
        </div>
    </div>
</template>