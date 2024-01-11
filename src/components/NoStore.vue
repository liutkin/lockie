<script lang="ts" setup>
import ct from 'countries-and-timezones'
import JSZip from 'jszip'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import DirectionIcon from '@/icons/direction.svg'
import GithubLink from "@/components/GithubLink.vue"
import TheLogo from "@/components/TheLogo.vue"
import LangList from "@/components/LangList.vue"
import ForbiddenService from "@/components/ForbiddenService.vue"
import NewStore from "@/components/NewStore.vue"
import UnlockingStore from "@/components/UnlockingStore.vue"
import BaseIcon from "@/components/BaseIcon.vue"

const { t } = useI18n()

const newStoreShown = ref(false)
const unzippedStore = ref(null)

const restoreCachedStore = () => {
    const cachedStore = window.localStorage.getItem('store')
    if (!cachedStore) return
    unzippedStore.value = cachedStore
}

const clearCachedData = () => {
    unzippedStore.value = null
    window.localStorage.removeItem('store')
}

const importStore = ({ target: { files } }) => {
    const archive = new JSZip()

    archive
        .loadAsync(files[0])
        .then(async (zip) => {
            unzippedStore.value = await zip.file('db').async('string')
        })
        .catch(() => notify({ type: 'error', text: t('errorUnzipping') }))
}
const { countries } = ct.getTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
const forbidden = countries.length === 1 && countries[0] === 'RU'

restoreCachedStore()
</script>

<template>
    <div
        class="border-shadow absolute inset-0 bg-gradient-radial-gray flex justify-center items-center z-10 p-8"
    >
        <GithubLink class="absolute bottom-8 right-8" />

        <div class="absolute top-0 left-0 right-0 p-8 flex justify-between items-center">
            <TheLogo class="hover:text-primary" />

            <LangList />
        </div>

        <ForbiddenService v-if="forbidden" />

        <div v-else class="grid grid-cols-12 w-full">
            <div class="col-span-12 md:col-span-6 xl:col-span-4 md:col-start-4 xl:col-start-5">
                <Transition name="fade-zoom" mode="out-in">
                    <NewStore v-if="newStoreShown" @cancel="newStoreShown = false" />

                    <UnlockingStore
                        v-else-if="unzippedStore"
                        :unzipped-store="unzippedStore"
                        @clear="clearCachedData"
                        @cancel="unzippedStore = null"
                    />

                    <div v-else>
                        <div class="text-center">
                            <div class="flex justify-center">
                                <DirectionIcon class="h-32 fill-current" />
                            </div>

                            <p class="my-8">{{ t('intro') }}</p>
                            
                            <div class="flex justify-center gap-x-4">
                                <button class="btn btn--alt" @click="newStoreShown = true">
                                    <BaseIcon class="w-4" name="book-plus" />

                                    {{ t('newStore') }}
                                </button>

                                <label for="importStoreFileInput" class="btn btn--primary">
                                    <BaseIcon class="w-4" name="cloud-upload" />

                                    {{ t('choose') }}...
                                </label>

                                <input
                                    id="importStoreFileInput"
                                    hidden
                                    type="file"
                                    @change="importStore"
                                />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<style scoped>
.border-shadow {
    box-shadow: 0 0.1rem 0 0.05rem theme('colors.primary');
}
</style>
