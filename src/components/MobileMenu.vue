<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import exportStore from '@/utilities/exportStore'
import toggleBodyOverflow from "@/utilities/toggleBodyOverflow"
import useNewPasswordCreation from '@/composables/useNewPasswordCreation'
import TheLogo from '@/components/TheLogo.vue'
import TheSidebar from '@/components/TheSidebar.vue'
import RecordEdit from "@/components/RecordEdit.vue"
import TheSettings from "@/components/TheSettings.vue"
import MenuIcon from '@/icons/menu.svg'
import SubmenuIcon from '@/icons/submenu.svg'

const { t } = useI18n()
const store = useStore()
const { RECORDS, LABEL } = storeToRefs(store)
const { END_SESSION } = store

const { newPasswordShown, create } = useNewPasswordCreation()

const settingsShown = ref(false)
const leftMenuShown = ref(false)
const rightMenuShown = ref(false)

watch([leftMenuShown, rightMenuShown], () =>
    toggleBodyOverflow(leftMenuShown.value || rightMenuShown.value)
)
watch(LABEL, () => {
    leftMenuShown.value = false
    rightMenuShown.value = false
})
</script>

<template>
    <header class="fixed top-0 left-0 right-0 flex flex-col z-10">
        <div class="mobile-menu flex justify-between relative">
            <TheLogo
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lite"
            />

            <button
                type="button"
                :class="{ 'bg-black/10': leftMenuShown }"
                class="p-0 w-12 h-12 flex justify-center items-center text-lite"
                @click="(leftMenuShown = !leftMenuShown), (rightMenuShown = false)"
            >
                <MenuIcon class="h-4 fill-current" />
            </button>

            <button
                type="button"
                :class="{ 'bg-black/10': rightMenuShown }"
                class="p-0 w-12 h-12 flex justify-center items-center text-lite"
                @click="(rightMenuShown = !rightMenuShown), (leftMenuShown = false)"
            >
                <SubmenuIcon class="h-5 fill-current" />
            </button>
        </div>

        <Transition name="slide-from-left" mode="out-in">
            <TheSidebar
                v-if="leftMenuShown"
                class="mobile-menu__panel overflow-auto border-shadow-right"
            />
        </Transition>

        <Transition name="slide-from-right" mode="out-in">
            <div
                v-if="rightMenuShown"
                class="bg-gradient-radial-gray flex flex-col mobile-menu__panel justify-between overflow-auto py-8 border-shadow-left"
            >
                <div class="grid gap-8">
                    <div
                        class="flex relative btn-indicator col-span-12 mt-8 mx-4"
                        :class="{ 'btn-indicator--active': newPasswordShown }"
                    >
                        <button
                            type="button"
                            class="btn btn--primary w-full relative z-10"
                            @click="(settingsShown = false), (newPasswordShown = !newPasswordShown)"
                        >
                            <span class="flex mr-2">
                                <mdicon name="lock-plus-outline" :size="18" />
                            </span>

                            {{ t('newPassword') }}
                        </button>
                    </div>

                    <Transition name="fade-zoom" mode="out-in">
                        <RecordEdit
                            v-if="newPasswordShown"
                            class="py-4 relative col-span-12"
                            @cancel="newPasswordShown = false"
                            @create="create"
                        />
                    </Transition>

                    <button
                        :disabled="!RECORDS.length"
                        type="button"
                        class="btn btn--primary col-span-12 mx-4"
                        @click="exportStore"
                    >
                        <span class="flex mr-2">
                            <mdicon name="database-export-outline" :size="18" />
                        </span>

                        {{ t('export') }}
                    </button>

                    <div
                        class="flex relative btn-indicator col-span-12 mx-4"
                        :class="{ 'btn-indicator--active': settingsShown }"
                    >
                        <button
                            type="button"
                            class="btn btn--alt w-full"
                            @click="(newPasswordShown = false), (settingsShown = !settingsShown)"
                        >
                            <span class="flex mr-2">
                                <mdicon name="cog-outline" :size="18" />
                            </span>

                            {{ t('settings') }}
                        </button>
                    </div>

                    <Transition name="fade-zoom" mode="out-in">
                        <div v-if="settingsShown" class="py-4 col-span-12">
                            <TheSettings @close="settingsShown = false" />
                        </div>
                    </Transition>
                </div>

                <button type="button" class="btn btn--alt mx-4 mt-4" @click="END_SESSION">
                    <span class="flex mr-2">
                        <mdicon name="power" :size="18" />
                    </span>

                    {{ t('shutdown') }}
                </button>
            </div>
        </Transition>
    </header>
</template>

<style scoped>
.mobile-menu {
    background: linear-gradient(45deg, rgba(74, 140, 211, 1) 0%, rgba(48, 158, 209, 1) 100%);
    &__panel {
        height: calc(100vh - 3rem);
    }
}

.border-shadow-right {
    box-shadow: 0.1rem 0 0 0.05rem theme('colors.primary');
}

.border-shadow-left {
    box-shadow: -0.1rem 0 0 0.05rem theme('colors.primary');
}
</style>
