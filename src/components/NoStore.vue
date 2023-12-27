<script lang="ts" setup>
import JSZip from 'jszip'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import DirectionIcon from '@/icon/direction.svg'
import ct from 'countries-and-timezones'

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
        <github-link class="absolute bottom-8 right-8" />
        <div class="absolute top-0 left-0 right-0 p-8 flex justify-between items-center">
            <the-logo class="hover:text-primary" />
            <lang-list />
        </div>
        <forbidden-service v-if="forbidden" />
        <div v-else class="grid grid-cols-12 w-full">
            <div class="col-span-12 md:col-span-6 xl:col-span-4 md:col-start-4 xl:col-start-5">
                <transition name="fade-zoom" mode="out-in">
                    <new-store v-if="newStoreShown" @cancel="newStoreShown = false" />
                    <unlocking-store
                        v-else-if="unzippedStore"
                        :unzipped-store="unzippedStore"
                        @clear="clearCachedData"
                        @cancel="unzippedStore = null"
                    />
                    <div v-else>
                        <div class="text-center">
                            <div class="flex justify-center">
                                <direction-icon class="h-32 fill-current" />
                            </div>
                            <p class="my-8">{{ t('intro') }}</p>
                            <div class="flex justify-center">
                                <button class="btn btn--alt mr-2" @click="newStoreShown = true">
                                    {{ t('newStore') }}
                                </button>
                                <label for="importStoreFileInput" class="btn btn--primary"
                                ><span class="flex mr-2">
                                        <mdicon name="database-import-outline" :size="18" />
                                    </span>
                                    {{ t('import') }}</label
                                >
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
