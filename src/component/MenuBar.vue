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
              class="btn btn--alt z-10"
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
          v-model.trim="search"
          autofocus
          clearable
          type="text"
          class="w-60"
          :placeholder="t('search')"
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
        v-model.trim="search"
        autofocus
        clearable
        type="text"
        :placeholder="t('search')"
        @clear="search = null"
      >
        <template #prefix>
          <div class="opacity-70 flex">
            <mdicon name="magnify" :width="32" :height="18" />
          </div>
        </template>
      </base-input>
    </div>
  </div>
</template>

<script setup>
import { debounce } from "lodash-es";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { exportStore } from "@/utility";
import { useNewPasswordCreation } from "@/mixin";
import { useStore } from "@/store";

const emit = defineEmits(["search"]);

const { t } = useI18n();
const store = useStore();
const { STORE, RECORDS } = storeToRefs(store);
const { END_SESSION } = store;
const { newPasswordShown, create } = useNewPasswordCreation();

const search = ref(null);
const settingsShown = ref(false);

const emitSearch = () => emit("search", search.value);
const debouncedEmitSearch = debounce(emitSearch, 500);

watch(search, () => (search.value ? debouncedEmitSearch() : emitSearch()));
</script>
