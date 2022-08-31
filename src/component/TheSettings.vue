<template>
  <div class="grid grid-cols-12 gap-y-8 md:gap-8 p-8 bg-gray rounded relative">
    <div class="col-span-12 xl:col-span-4">
      <div class="flex items-center">Lockie v{{ appVersion }}</div>
    </div>
    <ul class="my-0 pl-0 list-none col-span-12 xl:col-span-4 leading-relaxed">
      <li v-for="date in dates" :key="date.getter" :title="date.locale">
        {{ t(date.key) }}: {{ date.relative }}
      </li>
    </ul>
    <div class="grid grid-cols-12 gap-y-8 sm:gap-8 col-span-12 xl:col-span-4">
      <base-input
        v-model.trim="password"
        autocomplete="new-password"
        type="password"
        copyable
        strength-indicator
        visibility
        class="col-span-12 sm:col-span-6 lg:col-span-12"
        >{{ t("newPassword")
        }}<template #suffix>
          <button
            type="button"
            class="hover:text-primary flex cursor-pointer p-0 opacity-70"
            tabindex="-1"
            @click="generatePassword"
          >
            <mdicon name="dice-5-outline" :width="32" :height="18" />
          </button>
        </template>
      </base-input>
      <base-input
        v-model.trim="passwordConfirmation"
        autocomplete="new-password-confirmation"
        copyable
        visibility
        type="password"
        class="col-span-12 sm:col-span-6 lg:col-span-12"
        >{{ t("newPasswordConfirmation") }}
      </base-input>
    </div>
    <div class="grid grid-cols-12 gap-y-8 col-span-12 md:flex justify-end">
      <button
        type="button"
        class="btn btn--alt md:mr-4 col-span-12 order-1 md:order-none"
        @click="emit('close')"
      >
        {{ t("cancel") }}
      </button>
      <button :disabled="!formValid" class="btn btn--primary col-span-12" @click="save">
        <span class="flex mr-2">
          <mdicon name="check-circle-outline" :size="18" />
        </span>
        {{ t("save") }}
      </button>
    </div>
  </div>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { computed, onUnmounted } from "vue";
import { setPassword } from "@/store";
import BaseInput from "@/component/BaseInput.vue";
import { useDates, usePassword } from "@/mixin";
import { version } from "../../package.json";

const { t } = useI18n();

const emit = defineEmits(["close"]);

const appVersion = version;
const { dates, updateDates, stopUpdatingDates } = useDates();
const { password, passwordConfirmation, generatePassword } = usePassword();

updateDates({ updateMillisecondsFromStore: true });

const formValid = computed(
  () =>
    password.value && passwordConfirmation.value && password.value === passwordConfirmation.value
);
const save = () => {
  setPassword(password.value);

  password.value = null;
  passwordConfirmation.value = null;

  notify({ type: "success", text: t("saved") });
  emit("close");
};

onUnmounted(stopUpdatingDates);
</script>
