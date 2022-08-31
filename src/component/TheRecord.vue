<template>
  <div
    class="record grid grid-cols-12 gap-x-8 border-b border-gray-200 dark:border-white dark:border-opacity-5 py-8 lg:py-0"
  >
    <div class="col-span-12 lg:col-span-3 px-8 py-4 lg:px-4" :title="record.title">
      <div class="lg:hidden text-sm text-gray-400">{{ t("title") }}</div>
      <div class="flex items-center">
        <div :class="{ 'truncate min-w-0': isTitleUrl }">
          {{ record.title }}
        </div>
        <div v-if="isTitleUrl" class="record__action ml-2">
          <div class="flex">
            <button
              type="button"
              class="flex cursor-pointer p-0 opacity-70"
              :class="titleCopied ? 'text-green-600' : 'hover:text-primary'"
              tabindex="-1"
              @click="copyToClipboard(record.title), (titleCopied = true)"
            >
              <transition name="fade-zoom" mode="out-in">
                <mdicon v-if="titleCopied" name="check" :width="32" :height="18" />
                <mdicon v-else name="content-copy" :width="32" :height="18" />
              </transition>
            </button>
            <a
              :href="record.title"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-shrink-0 text-default hover:text-primary opacity-70"
              tabindex="-1"
            >
              <mdicon name="open-in-new" :width="32" :height="18" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-3 px-8 py-4 lg:px-4">
      <div class="lg:hidden text-sm text-gray-400">{{ t("login") }}</div>
      <div class="flex">
        <div class="break-all">
          {{ record.login }}
        </div>
        <div class="record__action ml-2">
          <div class="flex">
            <button
              type="button"
              class="flex cursor-pointer p-0 opacity-70"
              :class="loginCopied ? 'text-green-600' : 'hover:text-primary'"
              tabindex="-1"
              @click="copyToClipboard(record.login), (loginCopied = true)"
            >
              <transition name="fade-zoom" mode="out-in">
                <mdicon v-if="loginCopied" name="check" :width="32" :height="18" />
                <mdicon v-else name="content-copy" :width="32" :height="18" />
              </transition>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-3 px-8 py-4 lg:px-4">
      <div class="lg:hidden text-sm text-gray-400">{{ t("password") }}</div>
      <div class="flex">
        <div class="break-all">
          {{ formattedPassword }}
        </div>
        <div class="record__action ml-2">
          <div class="flex">
            <button
              type="button"
              class="flex cursor-pointer p-0 opacity-70"
              :class="passwordCopied ? 'text-green-600' : 'hover:text-primary'"
              tabindex="-1"
              @click="copyToClipboard(record.password), (passwordCopied = true)"
            >
              <transition name="fade-zoom" mode="out-in">
                <mdicon v-if="passwordCopied" name="check" :width="32" :height="18" />
                <mdicon v-else name="content-copy" :width="32" :height="18" />
              </transition>
            </button>
            <button
              type="button"
              class="hover:text-primary flex cursor-pointer p-0 opacity-70"
              tabindex="-1"
              @click="passwordVisible = !passwordVisible"
            >
              <mdicon v-if="passwordVisible" name="eye-outline" :width="32" :height="18" />
              <mdicon v-else name="eye-off-outline" :width="32" :height="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-3 px-8 py-4 lg:px-4">
      <div class="lg:hidden text-sm text-gray-400">{{ t("notes") }}</div>
      <div class="flex justify-between">
        <div class="max-h-80 overflow-auto whitespace-pre-wrap">{{ record.notes || "-" }}</div>
        <div class="flex record__action ml-2">
          <button
            type="button"
            class="hover:text-primary flex cursor-pointer p-0 opacity-70"
            tabindex="-1"
            @click="detailsShown = !detailsShown"
          >
            <mdicon v-if="detailsShown" name="chevron-up-circle-outline" :width="32" :height="18" />
            <mdicon v-else name="chevron-down-circle-outline" :width="32" :height="18" />
          </button>
        </div>
      </div>
    </div>
    <transition name="fade-zoom" mode="out-in">
      <record-edit
        v-if="detailsShown"
        :record="record"
        class="col-span-12 pt-4 pb-8"
        @cancel="detailsShown = false"
        @save="save"
        @remove="remove"
        @restore="restore"
        @purge="purge"
      />
    </transition>
  </div>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import isUrl from "is-url";
import { useI18n } from "vue-i18n";
import { notify } from "@kyvg/vue3-notification";
import { ref, watch, computed } from "vue";
import { deleteRecord, editRecord, restoreRecord, purgeRecord } from "@/store";
import { copyToClipboard } from "@/utility";

const { t } = useI18n();

const props = defineProps({
  record: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const titleCopied = ref(false);
const loginCopied = ref(false);
const passwordCopied = ref(false);
const passwordVisible = ref(false);
const detailsShown = ref(false);

const isTitleUrl = computed(() => isUrl(props.record.title));
const formattedPassword = computed(() =>
  passwordVisible.value
    ? props.record.password
    : props.record.password
        .split("")
        .map(() => "٭")
        .join("")
);

watch(titleCopied, copied => copied && setTimeout(() => (titleCopied.value = false), 1000));
watch(loginCopied, copied => copied && setTimeout(() => (loginCopied.value = false), 1000));
watch(passwordCopied, copied => copied && setTimeout(() => (passwordCopied.value = false), 1000));

const save = record => {
  editRecord(record);
  detailsShown.value = false;
  notify({ type: "success", text: t("saved") });
};
const remove = id => {
  deleteRecord(id);
  detailsShown.value = false;
  notify({ type: "success", text: t("deleted") });
};
const restore = id => {
  restoreRecord(id);
  detailsShown.value = false;
  notify({ type: "success", text: t("restored") });
};
const purge = id => {
  purgeRecord(id);
  detailsShown.value = false;
  notify({ type: "success", text: t("purged") });
};
</script>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<style scoped>
.record:hover .record__action {
  opacity: 1;
}

@media screen and (min-width: 992px) {
  .record__action {
    opacity: 0;
  }
}
</style>
