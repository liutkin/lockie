<template>
    <main class="lg:ml-80 bg-gradient-radial-gray lg:p-8 min-h-screen">
        <menu-bar @search="(str) => (search = str)" />
        <div class="hidden xl:grid grid-cols-12 gap-x-8 mt-8 rounded bg-gradient-gray">
            <div class="col-span-3 p-4">{{ t('title') }}</div>
            <div class="col-span-3 p-4">{{ t('login') }}</div>
            <div class="col-span-3 p-4">{{ t('password') }}</div>
            <div class="col-span-3 p-4">
                {{ t('notes') }}
            </div>
        </div>
        <template v-if="STORE">
            <div v-if="filteredRecords.length">
                <the-record
                    v-for="(record, index) in paginatedRecords"
                    :key="`${record.id}_${LABEL}_${search}`"
                    class="animate-fade-zoom opacity-0"
                    :style="{ animationDelay: `${index * 0.05}s` }"
                    :record="record"
                />
                <transition name="fade-zoom">
                    <div
                        v-if="filteredRecords.length > recordsPerPage"
                        :key="LABEL"
                        class="flex justify-center mt-4 pb-8"
                    >
                        <button
                            type="button"
                            class="pagination-btn flex justify-center items-center w-12 h-12 p-0 rounded"
                            :class="
                                PAGE === 1 ? 'cursor-not-allowed opacity-40' : 'hover:opacity-70'
                            "
                            :disabled="PAGE === 1"
                            @click="SET_PAGE(1)"
                        >
                            <span class="opacity-80">
                                <mdicon name="chevron-double-left" :size="16" />
                            </span>
                        </button>
                        <button
                            type="button"
                            class="pagination-btn flex justify-center items-center w-12 h-12 p-0 rounded"
                            :class="
                                PAGE === 1 ? 'cursor-not-allowed opacity-40' : 'hover:opacity-70'
                            "
                            :disabled="PAGE === 1"
                            @click="SET_PAGE(PAGE - 1)"
                        >
                            <span class="opacity-80">
                                <mdicon name="chevron-left" :size="16" />
                            </span>
                        </button>
                        <ul class="my-0 pl-0 list-none flex rounded">
                            <li
                                v-for="number in totalPages === 2 ? 2 : 3"
                                :key="number"
                                class="flex"
                            >
                                <button
                                    type="button"
                                    class="pagination-btn flex justify-center items-center w-12 h-12 p-0 rounded"
                                    :class="[
                                        getPageNumber(number) === PAGE
                                            ? 'text-primary font-bold'
                                            : 'hover:opacity-70',
                                        { 'pagination-btn--active': number === PAGE },
                                    ]"
                                    @click="SET_PAGE(getPageNumber(number))"
                                >
                                    {{ getPageNumber(number) }}
                                </button>
                            </li>
                        </ul>
                        <button
                            type="button"
                            class="pagination-btn flex justify-center items-center w-12 h-12 p-0 rounded"
                            :class="
                                PAGE === totalPages
                                    ? 'cursor-not-allowed opacity-40'
                                    : 'hover:opacity-70'
                            "
                            :disabled="PAGE === totalPages"
                            @click="SET_PAGE(PAGE + 1)"
                        >
                            <span class="opacity-8">
                                <mdicon name="chevron-right" :size="16" />
                            </span>
                        </button>
                        <button
                            type="button"
                            class="pagination-btn flex justify-center items-center w-12 h-12 p-0 rounded"
                            :class="[
                                PAGE === totalPages
                                    ? 'cursor-not-allowed opacity-40'
                                    : 'hover:opacity-70',
                            ]"
                            :disabled="PAGE === totalPages"
                            @click="SET_PAGE(totalPages)"
                        >
                            <span class="opacity-8">
                                <mdicon name="chevron-double-right" :size="16" />
                            </span>
                        </button>
                    </div>
                </transition>
            </div>
            <no-records v-else class="col-span-12 px-4 py-8" />
        </template>
    </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'

const { t } = useI18n()
const store = useStore()
const { STORE, RECORDS, LABEL, PAGE } = storeToRefs(store)
const { SET_PAGE } = store

const recordsPerPage = 10

const search = ref(null)

const labeledRecords = computed(() => {
    const filterAllNonTrashed = ({ trash }) => !trash
    const filterTrashed = ({ trash }) => trash
    const filterActiveNonTrashed = ({ labels, trash }) => labels.includes(LABEL.value) && !trash

    const method = LABEL.value
        ? filterActiveNonTrashed
        : LABEL.value === null
          ? filterAllNonTrashed
          : filterTrashed
    return RECORDS.value.filter(method)
})
const filteredRecords = computed(() =>
    search.value && search.value.length >= 3
        ? labeledRecords.value.filter((record) =>
              ['title', 'login', 'password', 'notes'].some(
                  (key) => record[key] && record[key].toLowerCase().includes(search.value)
              )
          )
        : labeledRecords.value
)
const totalPages = computed(() => Math.ceil(filteredRecords.value.length / recordsPerPage))
const paginatedRecords = computed(() =>
    filteredRecords.value.slice(
        (PAGE.value - 1) * recordsPerPage,
        (PAGE.value - 1) * recordsPerPage + recordsPerPage
    )
)

watch(LABEL, () => SET_PAGE(1))

const getPageNumber = (index) => {
    switch (index) {
        case 1: {
            return PAGE.value === 1 || totalPages.value === 2
                ? 1
                : PAGE.value === totalPages.value
                  ? PAGE.value - 2
                  : PAGE.value - 1
        }
        case 2:
            return PAGE.value === 1
                ? PAGE.value + 1
                : PAGE.value !== totalPages.value || totalPages.value === 2
                  ? PAGE.value
                  : PAGE.value - 1
        default:
            return PAGE.value === totalPages.value
                ? totalPages.value
                : PAGE.value >= 2
                  ? PAGE.value + 1
                  : PAGE.value + 2
    }
}
</script>

<style scoped>
.pagination-btn {
    &:not(.pagination-btn--active):not([disabled]) {
        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            @media (prefers-color-scheme: dark) {
                background-color: rgba(255, 255, 255, 0.05);
            }
        }
    }
}
</style>
