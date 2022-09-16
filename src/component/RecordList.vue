<template>
  <main class="lg:ml-80 bg-gradient-radial-gray lg:p-8 min-h-screen">
    <div class="hidden lg:flex justify-between items-center">
      <div
        class="flex relative btn-indicator"
        :class="{ 'btn-indicator--active': newPasswordShown }"
      >
        <button
          type="button"
          class="btn btn--primary relative z-10"
          @click="(settingsShown = false), (newPasswordShown = !newPasswordShown)"
        >
          <span class="flex mr-2">
            <mdicon name="lock-plus-outline" :size="18" />
          </span>
          {{ t("newPassword") }}
        </button>
      </div>
      <div class="flex items-center">
        <github-link class="mr-12 xl:mr-6" />
        <div class="xl:hidden flex items-center">
          <button
            type="button"
            class="flex justify-center items-center w-8 h-8 hover:text-primary mr-4"
            @click="END_SESSION"
          >
            <mdicon name="power" :size="18" />
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
              <mdicon name="cog-outline" :size="18" />
            </button>
          </div>
        </div>
        <div class="hidden xl:flex items-center">
          <button type="button" class="btn btn--alt mr-2" @click="END_SESSION">
            <span class="flex mr-2">
              <mdicon name="power" :size="18" />
            </span>
            {{ t("shutdown") }}
          </button>
          <div
            class="flex relative btn-indicator mr-4"
            :class="{ 'btn-indicator--active': settingsShown }"
          >
            <button
              type="button"
              class="btn btn--alt"
              @click="(newPasswordShown = false), (settingsShown = !settingsShown)"
            >
              <span class="flex mr-2">
                <mdicon name="cog-outline" :size="18" />
              </span>
              {{ t("settings") }}
            </button>
          </div>
        </div>
        <base-input
          :model-value="search"
          autocomplete="search"
          autofocus
          clearable
          type="text"
          class="w-60"
          :placeholder="t('search')"
          @input="setSearchDebounced"
          @clear="search = null"
        >
          <template #prefix>
            <div class="opacity-70 flex">
              <mdicon name="magnify" :width="32" :height="18" />
            </div> </template
        ></base-input>
        <button
          :disabled="!STORE || !RECORDS.length"
          type="button"
          class="btn btn--primary ml-4"
          @click="exportStore"
        >
          <span class="flex mr-2">
            <mdicon name="database-export-outline" :size="18" />
          </span>
          {{ t("export") }}
        </button>
      </div>
    </div>
    <div>
      <transition name="fade-zoom" mode="out-in">
        <record-edit
          v-if="newPasswordShown"
          class="py-16 relative"
          @cancel="newPasswordShown = false"
          @create="create"
        />
      </transition>
    </div>
    <div class="overflow-hidden">
      <transition name="fade-zoom" mode="out-in">
        <div v-if="settingsShown" class="py-16">
          <the-settings @close="settingsShown = false" />
        </div>
      </transition>
    </div>
    <div class="lg:hidden px-4 pt-10 pb-6">
      <base-input
        :model-value="search"
        autocomplete="search"
        autofocus
        clearable
        type="text"
        :placeholder="t('search')"
        @input="setSearchDebounced"
        @clear="search = null"
      >
        <template #prefix>
          <div class="opacity-70 flex">
            <mdicon name="magnify" :width="32" :height="18" />
          </div>
        </template>
      </base-input>
    </div>
    <div>
      <div class="hidden xl:grid grid-cols-12 gap-x-8 mt-8 rounded bg-gradient-gray">
        <div class="col-span-3 p-4">{{ t("title") }}</div>
        <div class="col-span-3 p-4">{{ t("login") }}</div>
        <div class="col-span-3 p-4">{{ t("password") }}</div>
        <div class="col-span-3 p-4">
          {{ t("notes") }}
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
                :class="PAGE === 1 ? 'cursor-not-allowed opacity-40' : 'hover:opacity-70'"
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
                :class="PAGE === 1 ? 'cursor-not-allowed opacity-40' : 'hover:opacity-70'"
                :disabled="PAGE === 1"
                @click="SET_PAGE(PAGE - 1)"
              >
                <span class="opacity-80">
                  <mdicon name="chevron-left" :size="16" />
                </span>
              </button>
              <ul class="my-0 pl-0 list-none flex rounded">
                <li v-for="number in totalPages === 2 ? 2 : 3" :key="number" class="flex">
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
                :class="PAGE === totalPages ? 'cursor-not-allowed opacity-40' : 'hover:opacity-70'"
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
                  PAGE === totalPages ? 'cursor-not-allowed opacity-40' : 'hover:opacity-70',
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
    </div>
  </main>
</template>

<script setup>
import { debounce } from "lodash-es";
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { exportStore } from "@/utility";
import { useNewPasswordCreation } from "@/mixin";
import { useStore } from "@/store";

const { t } = useI18n();
const store = useStore();
const { STORE, RECORDS, LABEL, PAGE } = storeToRefs(store);
const { END_SESSION, SET_PAGE } = store;
const { newPasswordShown, create } = useNewPasswordCreation();

const search = ref(null);
const settingsShown = ref(false);
const recordsPerPage = 10;

const labeledRecords = computed(() =>
  LABEL.value === null
    ? RECORDS.value.filter(({ trash }) => !trash)
    : LABEL.value === false
    ? RECORDS.value.filter(({ trash }) => trash)
    : RECORDS.value.filter(({ labels, trash }) => labels.includes(LABEL.value) && !trash)
);
const filteredRecords = computed(() =>
  search.value && search.value.length >= 3
    ? [
        ...labeledRecords.value.filter(record =>
          ["title", "login", "password", "notes"].some(
            key => record[key] && record[key].toLowerCase().includes(search.value)
          )
        ),
      ]
    : labeledRecords.value
);
const totalPages = computed(() => Math.ceil(filteredRecords.value.length / recordsPerPage));
const paginatedRecords = computed(() =>
  filteredRecords.value.slice(
    (PAGE.value - 1) * recordsPerPage,
    (PAGE.value - 1) * recordsPerPage + recordsPerPage
  )
);

watch(LABEL, () => SET_PAGE(1));

const getPageNumber = index => {
  switch (index) {
    case 1: {
      return PAGE.value === 1 || totalPages.value === 2
        ? 1
        : PAGE.value === totalPages.value
        ? PAGE.value - 2
        : PAGE.value - 1;
    }
    case 2:
      return PAGE.value === 1
        ? PAGE.value + 1
        : PAGE.value !== totalPages.value || totalPages.value === 2
        ? PAGE.value
        : PAGE.value - 1;
    default:
      return PAGE.value === totalPages.value
        ? totalPages.value
        : PAGE.value >= 2
        ? PAGE.value + 1
        : PAGE.value + 2;
  }
};
const setSearch = event => (search.value = event.target.value.trim());

const setSearchDebounced = debounce(setSearch, 500);
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
