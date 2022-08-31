<template>
  <div class="bg-gradient-gray flex flex-col">
    <template v-if="STORE">
      <div class="flex justify-between items-center p-8">
        <the-logo />
        <lang-list />
      </div>
      <div class="flex-grow overflow-auto">
        <button
          type="button"
          class="tab flex items-center px-8 py-4 w-full"
          :class="{ 'tab--active': LABEL === null }"
          @click="setLabel(null)"
        >
          <span class="flex mr-2 opacity-70">
            <mdicon name="database-outline" :size="18" />
          </span>
          {{ t("allPasswords")
          }}<span class="tab__indicator text-xs text-gray-400"
            >{{ RECORDS.length - trashCount }}
          </span>
        </button>
        <ul class="my-0 pl-0 list-none">
          <li v-for="label in UNIQUE_LABELS" :key="label" class="label relative">
            <button
              type="button"
              class="tab flex items-center pl-8 pr-12 py-4 w-full capitalize"
              :class="{ 'tab--active': LABEL === label.name }"
              @click="setLabel(label.name)"
            >
              <span class="flex mr-2 opacity-70">
                <mdicon name="label-outline" :size="18" />
              </span>
              {{ label.name
              }}<span class="tab__indicator text-xs text-gray-400">{{ label.count }} </span>
            </button>
            <button
              type="button"
              class="label-settings-btn hidden w-6 h-6 justify-center items-center absolute inset-y-0 right-2 opacity-60 my-auto rounded-full hover:bg-opacity-10 hover:bg-black transition-all duration-200"
              @click="editLabel(label.name)"
            >
              <mdicon name="cog" :size="12" />
            </button>
          </li>
        </ul>
      </div>
      <button
        type="button"
        class="tab flex items-center px-8 py-4 w-full"
        :class="{ 'tab--active': LABEL === false }"
        @click="setLabel(false)"
      >
        <span class="flex mr-2 opacity-70">
          <mdicon name="trash-can-outline" :size="18" />
        </span>
        {{ t("deletedLabel")
        }}<span class="tab__indicator text-xs text-gray-400">{{ trashCount }} </span>
      </button>
      <base-modal v-model="labelEditingModalShown">
        <template #content>
          <div class="p-6 bg-gray">
            <base-input v-model.trim="labelForEditing" autofocus class="col-span-12"
              >{{ t("label") }}
            </base-input>
          </div>
        </template>
        <template #action>
          <div class="grid gap-y-8 md:gap-x-6 lg:flex justify-between p-6 bg-white">
            <div class="hidden lg:flex items-center col-span-12 md:col-span-6">
              <div class="flex relative mr-4">
                <button
                  type="button"
                  class="btn btn--red"
                  @mousedown="startDeletion"
                  @mouseup="cancelDeletion"
                >
                  {{ t("delete") }}
                </button>
                <div
                  :class="{ 'progress--active': deletionProgress }"
                  class="progress absolute top-full left-0 h-2"
                />
              </div>
              <div class="text-xs text-gray-400 dark:text-white dark:text-opacity-40">
                {{ t("pressAndHoldToDelete") }}
              </div>
            </div>
            <div class="grid gap-y-8 md:flex col-span-12">
              <button
                type="button"
                class="btn btn--alt md:mr-4 col-span-12 order-1 md:order-none"
                @click="labelForEditing = null"
              >
                {{ t("cancel") }}
              </button>
              <button
                :disabled="!newLabelValid"
                class="btn btn--primary col-span-12"
                @click="saveLabel"
              >
                <span class="flex mr-2">
                  <mdicon name="check-circle-outline" :size="18" />
                </span>
                {{ t("save") }}
              </button>
            </div>
            <div class="lg:hidden col-span-12">
              <div class="mb-2">
                {{ t("cancel") }}
                <span class="text-sm text-gray-400">({{ t("slideRightToDelete") }})</span>
              </div>
              <input
                ref="cancelRangeInput"
                v-model.number="remove"
                type="range"
                min="0"
                max="100"
                step="1"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </base-modal>
    </template>
  </div>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import { notify } from "@kyvg/vue3-notification";
import { ref, computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import TheLogo from "@/component/TheLogo.vue";
import LangList from "@/component/LangList.vue";
import BaseModal from "@/component/BaseModal.vue";
import BaseInput from "@/component/BaseInput.vue";
import {
  STORE,
  RECORDS,
  LABEL,
  UNIQUE_LABELS,
  setLabel,
  removeRecordLabel,
  editRecordLabel,
} from "@/store";

const { t } = useI18n();

const labelForEditingOriginal = ref(null);
const labelForEditing = ref(null);
const labelEditingModalShown = ref(false);
const remove = ref(0);
const deletionInterval = ref(null);
const deletionProgress = ref(0);

const trashCount = computed(() => RECORDS.value.filter(({ trash }) => trash).length);
const newLabelValid = computed(
  () =>
    labelForEditing.value.length &&
    UNIQUE_LABELS.value.every(({ name }) => name !== labelForEditing.value)
);

const editLabel = label => {
  labelForEditingOriginal.value = label;
  labelForEditing.value = label;
};
const removeLabel = () => {
  removeRecordLabel(labelForEditing.value);
  labelForEditing.value = null;
  notify({ type: "success", text: t("deleted") });
  setLabel(null);
};
const saveLabel = () => {
  editRecordLabel(labelForEditingOriginal.value.trim().toLowerCase(), labelForEditing.value);
  labelForEditing.value = null;
  notify({ type: "success", text: t("edited") });
};
const cancelDeletion = () => {
  clearInterval(deletionInterval.value);
  deletionInterval.value = null;
  deletionProgress.value = 0;
};
const incrementDeletionProgress = () => {
  if (deletionProgress.value >= 100) {
    cancelDeletion();
    return;
  }
  deletionProgress.value += 2;
};
const startDeletion = () => {
  incrementDeletionProgress();
  deletionInterval.value = setInterval(incrementDeletionProgress, 25);
};

watchEffect(() => {
  if (!labelEditingModalShown.value) labelForEditing.value = null;
});
watchEffect(
  () =>
    (labelEditingModalShown.value =
      labelForEditing.value !== null || Boolean(labelForEditing.value))
);
watchEffect(() => deletionProgress.value >= 100 && removeLabel());
</script>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<style scoped>
.tab {
  text-align: left;
}

.tab:not(.tab--active):hover,
.tab:not(.tab--active):focus {
  background: #e8e8e8;
}

.label:hover .label-settings-btn,
.label:focus .label-settings-btn {
  display: flex;
}

.tab__indicator {
  transform: translate(0.25rem, -0.5rem);
}

.tab.tab--active {
  background: linear-gradient(45deg, #fdfdfd 0%, #f3f3f3 100%);
}

@media (prefers-color-scheme: dark) {
  .tab.tab--active {
    background: linear-gradient(45deg, #122230 0%, #111f2e 100%);
  }
  .tab:not(.tab--active):hover,
  .tab:not(.tab--active):focus {
    background: rgba(0, 0, 0, 0.07);
  }
}
</style>