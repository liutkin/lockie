<template>
  <div>
    <div class="grid grid-cols-12 gap-y-8 sm:gap-8 px-4 py-8 lg:px-8 bg-gray rounded content-start">
      <base-input
        v-model.trim="form.login"
        :autofocus="!editing"
        copyable
        class="col-span-12 sm:col-span-6 xl:col-span-4"
        >{{ t("login") }}</base-input
      >
      <base-input
        v-model.trim="form.password"
        autocomplete="new-password"
        copyable
        visibility
        strength-indicator
        type="password"
        class="col-span-12 sm:col-span-6 xl:col-span-4"
        >{{ t("password")
        }}<template #suffix>
          <button
            type="button"
            class="hover:text-primary flex cursor-pointer p-0 opacity-70"
            tabindex="-1"
            @click="generatePassword"
          >
            <mdicon name="dice-5-outline" :width="32" :height="18" />
          </button> </template
      ></base-input>
      <base-input
        v-model.trim="form.passwordConfirmation"
        autocomplete="new-password-confirmation"
        visibility
        type="password"
        class="col-span-12 sm:col-span-6 xl:col-span-4"
        >{{ t("passwordConfirmation") }}</base-input
      >
      <base-input v-model.trim="form.title" copyable class="col-span-12 sm:col-span-6 xl:col-span-4"
        >{{ t("title") }}
      </base-input>
      <base-input v-model.trim="form.notes" textarea class="col-span-12 sm:col-span-6 xl:col-span-4"
        >{{ t("notes") }} <span class="text-xs"> ({{ t("optional") }}) </span></base-input
      >
      <div class="col-span-12 sm:col-span-6 xl:col-span-4">
        <div class="flex items-end">
          <base-input
            v-model.trim="label"
            :autocomplete-list="UNIQUE_LABELS"
            class="flex-grow"
            @keyup.enter.stop="addLabel"
            @autocomplete="autocompleteLabel"
            >{{ t("labels") }} <span class="text-xs"> ({{ t("optional") }}) </span></base-input
          >
          <button
            :disabled="!labelValid"
            type="button"
            class="btn btn--primary ml-2"
            @click="addLabel"
          >
            <span class="flex mr-1">
              <mdicon name="plus-circle-outline" :size="18" />
            </span>
            {{ t("add") }}
          </button>
        </div>
        <transition-group tag="ul" name="fade-zoom" class="mt-4 pl-0 list-none flex flex-wrap">
          <li v-for="existingLabel in form.labels" :key="existingLabel" class="m-1">
            <button type="button" class="btn btn--alt btn--sm" @click="removeLabel(existingLabel)">
              <span class="flex mr-1">
                <mdicon name="label-outline" :size="12" />
              </span>
              {{ existingLabel }}
            </button>
          </li>
        </transition-group>
      </div>
      <div class="grid grid-cols-12 gap-8 col-span-12 leading-tight">
        <template v-if="form.trash">
          <div class="md:hidden col-span-12 order-1 md:order-none">
            <div class="mb-2">
              {{ t("purge") }}
              <span class="text-sm text-gray-400">({{ t("slideRightToPurge") }})</span>
            </div>
            <input
              ref="purgeRangeInput"
              v-model.number="purge.progress"
              type="range"
              min="0"
              max="100"
              step="1"
              class="w-full"
            />
          </div>
          <div class="hidden md:flex items-center col-span-12 md:col-span-6 xl:col-span-3">
            <div class="flex relative mr-4">
              <button
                type="button"
                class="btn btn--red"
                @mousedown="startPurge"
                @mouseup="cancelPurge"
              >
                {{ t("purge") }}
              </button>
              <div
                :class="{ 'progress--active': purge.progress }"
                class="progress absolute top-full left-0 h-2"
              />
            </div>
            <div class="text-xs text-gray-400">
              {{ t("pressAndHoldToRemoveFromStore") }}
            </div>
          </div>
          <div
            class="flex flex-column md:flex-row items-center col-span-12 md:col-span-6 xl:col-span-4"
          >
            <button
              type="button"
              class="btn btn--alt w-full md:w-auto md:mr-4 order-1 md:order-none"
              @click="emit('restore', form.id)"
            >
              {{ t("restore") }}
            </button>
            <div class="text-xs text-gray-400 mb-2 lg:mb-0">
              {{ t("deleted") }}: <span :title="deleted.local">{{ deleted.relative }}</span>
            </div>
          </div>
        </template>
        <div v-else-if="editing" class="col-span-12 md:col-span-6 order-1 md:order-none">
          <button
            type="button"
            class="btn btn--red w-full md:w-auto"
            @click="emit('remove', form.id)"
          >
            {{ t("delete") }}
          </button>
        </div>
        <div
          class="col-span-12 md:flex items-center md:justify-end"
          :class="{ 'xl:col-span-5': form.trash, 'md:col-span-6': editing && !form.trash }"
        >
          <div
            v-if="editing"
            class="text-xs text-gray-400 md:mr-8 mb-4 lg:mb-0 text-center lg:text-right"
          >
            <div>
              {{ t("created") }}: <span :title="created.local">{{ created.relative }}</span>
            </div>
            <div v-if="edited.milliseconds">
              {{ t("edited") }}:<span :title="edited.local">{{ edited.relative }}</span>
            </div>
          </div>
          <div class="grid gap-y-8 md:flex col-span-12">
            <button
              type="button"
              class="btn btn--alt md:mr-4 col-span-12 order-1 md:order-none"
              @click="$emit('cancel')"
            >
              {{ t("cancel") }}
            </button>
            <button
              v-if="editing"
              :disabled="!formValid"
              class="btn btn--primary col-span-12"
              @click="save"
            >
              <span class="flex mr-2">
                <mdicon name="check-circle-outline" :size="18" />
              </span>
              {{ t("save") }}
            </button>
            <button
              v-else
              :disabled="!formValid"
              class="btn btn--primary col-span-12"
              @click="create"
            >
              <span class="flex mr-2">
                <mdicon name="lock-plus-outline" :size="18" />
              </span>
              {{ t("create") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { isEqual, cloneDeep } from "lodash-es";
import { useI18n } from "vue-i18n";
import { ref, computed, watch, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { onClickOutside } from "@vueuse/core";
import { useDates, usePassword } from "@/mixin";
import { useStore } from "@/store";

const { t } = useI18n();
const store = useStore();
const { UNIQUE_LABELS } = storeToRefs(store);

const props = defineProps({
  record: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["cancel", "save", "create", "remove", "restore", "purge"]);

const { password, passwordConfirmation, generatePassword } = usePassword();
const { dates, updateDates, stopUpdatingDates } = useDates([
  { key: "created" },
  { key: "edited" },
  { key: "deleted" },
]);

const label = ref(null);
const purgeRangeInput = ref(null);
const form = ref({
  id: null,
  title: null,
  login: null,
  password,
  passwordConfirmation,
  notes: null,
  trash: null,
  labels: [],
  label: null,
});
const purge = ref({
  interval: null,
  progress: 0,
});

const created = computed(() => dates.value.find(({ key }) => key === "created"));
const edited = computed(() => dates.value.find(({ key }) => key === "edited"));
const deleted = computed(() => dates.value.find(({ key }) => key === "deleted"));
const labelValid = computed(() => !form.value.labels.includes(label.value) && label.value);
const editing = computed(() => Object.keys(props.record).length);
const formValid = computed(
  () =>
    form.value.title &&
    form.value.login &&
    form.value.password &&
    form.value.passwordConfirmation &&
    form.value.password === form.value.passwordConfirmation
);
const recordChanged = computed(
  () =>
    editing.value &&
    !isEqual(
      {
        title: props.record.title,
        login: props.record.login,
        password: props.record.password,
        notes: props.record.notes,
        labels: props.record.labels,
      },
      {
        title: form.value.title,
        login: form.value.login,
        password: form.value.password,
        notes: form.value.notes,
        labels: form.value.labels,
      }
    )
);

const save = () => {
  if (!formValid.value) return;

  const { id, title, login, password: formPassword, notes, labels, trash } = form.value;

  emit("save", {
    id,
    title,
    login,
    password: formPassword,
    notes,
    labels,
    trash,
    created: created.value.milliseconds,
    deleted: deleted.value.milliseconds,
    edited: recordChanged.value ? Date.now() : edited.value.milliseconds,
  });
};
const create = () => {
  if (!formValid.value) return;

  const { title, login, password: formPassword, notes, labels } = form.value;

  emit("create", {
    id: uuidv4(),
    title,
    login,
    password: formPassword,
    notes,
    labels,
    trash: false,
    edited: null,
    deleted: null,
    created: Date.now(),
  });
};
const incrementActionProgress = () => {
  if (purge.value.progress >= 100) {
    clearInterval(purge.value.interval);
    return;
  }
  purge.value.progress += 2;
};
const addLabel = () => {
  if (!labelValid.value) return;

  form.value.labels.push(label.value);
  label.value = null;
};
const autocompleteLabel = newLabel => {
  form.value.labels.push(newLabel);
  label.value = null;
};
const removeLabel = labelToRemove => {
  form.value.labels = form.value.labels.filter(existingLabel => existingLabel !== labelToRemove);
};
const startPurge = name => {
  incrementActionProgress(name);
  purge.value.interval = setInterval(() => incrementActionProgress(name), 25);
};
const cancelPurge = () => {
  clearInterval(purge.value.interval);
  purge.value.progress = 0;
};

onClickOutside(purgeRangeInput, () => (purge.value.progress = 0));

watch(
  () => purge.value.progress,
  () => purge.value.progress >= 100 && emit("purge", form.value.id)
);

onUnmounted(stopUpdatingDates);

if (editing.value) {
  form.value = cloneDeep(props.record);
  form.value.passwordConfirmation = form.value.password;

  dates.value.forEach(date => (date.milliseconds = form.value[date.key]));
  updateDates();
}
</script>
