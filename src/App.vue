<template>
    <div ref="app">
        <div class="lg:pt-0" :class="{ 'pt-12': STORE }">
            <MobileMenu v-if="STORE" class="lg:hidden" />

            <TheSidebar class="w-80 hidden lg:flex flex-column fixed top-0 bottom-0 left-0" />

            <record-list />

            <Transition name="slide-from-bottom">
                <NoStore v-if="!STORE" />
            </Transition>

            <Notifications position="bottom right" />
        </div>

        <reload-prompt />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { storeToRefs } from "pinia"
import { Notifications } from "@kyvg/vue3-notification"
import { useStore } from "@/store"
import MobileMenu from "@/components/MobileMenu.vue"
import TheSidebar from "@/components/TheSidebar.vue"
import RecordList from "@/components/RecordList.vue"
import NoStore from "@/components/NoStore.vue"
import ReloadPrompt from "@/components/ReloadPrompt.vue"

const store = useStore()
const { STORE, LABEL, PAGE, PASSWORD } = storeToRefs(store)
const { SET_EDITED_DATE, CACHE_STORE } = store

const app = ref(null)

watch(
    [STORE, PASSWORD],
    () => {
        if (!STORE.value) return

        SET_EDITED_DATE()
        CACHE_STORE()
    },
    { deep: true }
)
watch([LABEL, PAGE], () => (app.value as null | HTMLElement)?.scrollIntoView())
</script>
