<template>
  <div
    class="no-store absolute inset-0 bg-gradient-radial-gray flex justify-center items-center z-10 p-8"
  >
    <div class="absolute top-0 left-0 right-0 p-8 flex justify-between items-center">
      <the-logo />
      <lang-list />
    </div>
    <div class="grid grid-cols-12 w-full">
      <div class="col-span-12 md:col-span-6 lg:col-span-4 md:col-start-4 lg:col-start-5">
        <transition name="fade-zoom" mode="out-in">
          <form v-if="newStoreShown" @submit.prevent="createStore">
            <h1 class="text-2xl font-bold">
              {{ t("newStoreTitle") }}
            </h1>
            <div class="grid gap-y-8 my-8">
              <base-input
                v-model.trim="password"
                strength-indicator
                type="password"
                copyable
                visibility
                autofocus
                class="col-span-12"
                >{{ t("password")
                }}<template #suffix>
                  <button
                    type="button"
                    class="hover:text-primary flex cursor-pointer p-0 opacity-70 col-span-12"
                    tabindex="-1"
                    @click="generatePassword"
                  >
                    <mdicon name="dice-5-outline" :width="32" :height="18" />
                  </button>
                </template>
              </base-input>
              <base-input
                v-model.trim="passwordConfirmation"
                copyable
                visibility
                type="password"
                class="col-span-12"
                >{{ t("passwordConfirmation") }}
              </base-input>
            </div>
            <p class="text-red-500 dark:text-red-400 my-8 text-sm">{{ t("storePasswordInfo") }}</p>
            <div class="flex justify-between">
              <button type="button" class="btn btn--alt" @click="newStoreShown = false">
                {{ t("cancel") }}
              </button>
              <button :disabled="!formValid" class="btn btn--primary">
                {{ t("create") }}
              </button>
            </div>
          </form>
          <form v-else-if="unzippedStore" class="relative" @submit.prevent="unlocking = true">
            <div class="absolute opacity-70 bottom-full left-1/2 transform -translate-x-1/2 mb-8">
              <div
                class="flex"
                :class="{ 'animate-bob': unlockingAttemptsLeft === 3 && !decryptedStore }"
              >
                <lock-good-icon v-if="decryptedStore" class="lockie-img fill-current" />
                <lock-waiting-icon
                  v-else-if="unlockingAttemptsLeft === 3"
                  class="lockie-img fill-current"
                />
                <lock-bad1-icon
                  v-else-if="unlockingAttemptsLeft === 2"
                  class="lockie-img fill-current"
                />
                <lock-bad2-icon
                  v-else-if="unlockingAttemptsLeft === 1"
                  class="lockie-img fill-current"
                />
                <lock-bad3-icon
                  v-else-if="unlockingAttemptsLeft === 0"
                  class="lockie-img fill-current"
                />
                <transition name="fade-zoom"
                  ><b
                    v-if="unlockingAttemptsLeft === 3 && !decryptedStore"
                    class="absolute top-0 left-full"
                    >zZz</b
                  ></transition
                >
              </div>
            </div>
            <div
              :class="{ 'opacity-0': unlockingAttemptsLeft < 1 || decryptedStore }"
              class="transition-all duration-300"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-2xl font-bold mb-1">
                    {{ t("unlockingStore") }}
                    <span v-if="existingDates.length" class="opacity-30">({{ t("cached") }})</span>
                  </div>
                  <ul
                    v-if="existingDates.length"
                    class="dates my-0 pl-0 list-none flex flex-wrap items-center text-xs"
                  >
                    <li v-for="date in existingDates" :key="date.key" :title="date.locale">
                      {{ t(date.key) }}: {{ date.relative }}
                    </li>
                  </ul>
                </div>
                <div class="flex opacity-70 ml-4">
                  <lock-mechanism-icon
                    class="h-14 fill-current"
                    :class="{ 'animate-rotate': unlocking }"
                  />
                </div>
              </div>
              <div class="grid gap-y-8 my-8">
                <div class="col-span-12 relative">
                  <base-input
                    ref="passwordUnlockInput"
                    v-model.trim="passwordUnlock"
                    visibility
                    autofocus
                    type="password"
                    :disabled="unlocking"
                    class="col-span-12"
                    >{{ t("password") }}
                  </base-input>
                </div>
              </div>
              <div class="grid gap-y-8 lg:flex justify-between">
                <div
                  v-if="existingDates.length"
                  class="hidden lg:flex items-center col-span-12 md:col-span-6"
                >
                  <div class="flex relative mr-4">
                    <button
                      type="button"
                      class="btn btn--red"
                      @mousedown="startCancellation"
                      @mouseup="cancelCancellation"
                    >
                      {{ t("cancel") }}
                    </button>
                    <div
                      :class="{ 'progress--active': cancellationProgress }"
                      class="progress absolute top-full left-0 h-2"
                    />
                  </div>
                  <div class="text-xs text-gray-400 dark:text-white dark:text-opacity-40">
                    {{ t("pressAndHoldToCancel") }}
                  </div>
                </div>
                <button
                  v-else
                  type="button"
                  class="btn btn--alt col-span-12"
                  @click="unzippedStore = null"
                >
                  {{ t("cancel") }}
                </button>
                <button
                  :disabled="!passwordUnlock || unlocking"
                  class="btn btn--primary col-span-12"
                >
                  {{ t("unlock") }}
                </button>
                <div v-if="existingDates.length" class="lg:hidden col-span-12">
                  <div class="mb-2">
                    {{ t("cancel") }}
                    <span class="text-sm text-gray-400">({{ t("slideRightToCancel") }})</span>
                  </div>
                  <input
                    ref="cancelRangeInput"
                    v-model.number="cancel"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </form>
          <div v-else>
            <div class="text-center">
              <div class="flex justify-center"><direction-icon class="h-32 fill-current" /></div>
              <p class="my-8">{{ t("noStore") }}</p>
              <div class="flex justify-center">
                <button class="btn btn--alt mr-2" @click="newStoreShown = true">
                  {{ t("newStore") }}
                </button>
                <label for="import_store_input" class="btn btn--primary">{{ t("import") }}</label>
                <input id="import_store_input" hidden type="file" @change="importStore" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import JSZip from "jszip";
import crypto from "crypto-js";
import { useI18n } from "vue-i18n";
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { onClickOutside } from "@vueuse/core";
import TheLogo from "@/component/TheLogo.vue";
import LangList from "@/component/LangList.vue";
import BaseInput from "@/component/BaseInput.vue";
import { useDates, usePassword } from "@/mixin";
import { setStore } from "@/store";
import LockMechanismIcon from "@/icon/lock-mechanism.svg";
import DirectionIcon from "@/icon/direction.svg";
import LockGoodIcon from "@/icon/lock-good.svg";
import LockWaitingIcon from "@/icon/lock-waiting.svg";
import LockBad1Icon from "@/icon/lock-bad-1.svg";
import LockBad2Icon from "@/icon/lock-bad-2.svg";
import LockBad3Icon from "@/icon/lock-bad-3.svg";

const { t } = useI18n();

const { dates, existingDates, updateDates, stopUpdatingDates } = useDates();
const { password, passwordConfirmation, generatePassword } = usePassword();

const cancel = ref(0);
const cancelRangeInput = ref(null);
const passwordUnlockInput = ref(null);
const newStoreShown = ref(false);
const unlocking = ref(false);
const creating = ref(false);
const passwordUnlock = ref(null);
const unlockingAttemptsLeft = ref(3);
const unzippedStore = ref(null);
const decryptedStore = ref(null);
const cancellationInterval = ref(null);
const cancellationProgress = ref(0);
const file = ref({
  lastModified: null,
  name: null,
  size: null,
});

const formValid = computed(
  () =>
    password.value && passwordConfirmation.value && password.value === passwordConfirmation.value
);

const restoreCachedStore = () => {
  const cachedStore = window.localStorage.getItem("store");
  if (cachedStore) {
    unzippedStore.value = cachedStore;
    dates.value.forEach(date => {
      const cachedStoreDate = window.localStorage.getItem(date.key);
      if (cachedStoreDate) {
        date.milliseconds = JSON.parse(cachedStoreDate)[date.key];
      }
    });
  }
};

const cancelCancellation = () => {
  clearInterval(cancellationInterval.value);
  cancellationInterval.value = null;
  cancellationProgress.value = 0;
};

const clearCachedData = () => {
  unzippedStore.value = null;
  unlockingAttemptsLeft.value = 3;
  window.localStorage.removeItem("store");
  existingDates.value.forEach(date => {
    window.localStorage.removeItem(date.key);
    clearInterval(date.intervalId);
    date.milliseconds = null;
    date.relative = null;
    date.locale = null;
  });
  file.value.lastModified = null;
  file.value.name = null;
  file.value.size = null;
};

const incrementCancellationProgress = () => {
  if (cancellationProgress.value >= 100) {
    cancelCancellation();
    clearCachedData();
    return;
  }
  cancellationProgress.value += 2;
};

const startCancellation = () => {
  incrementCancellationProgress();
  cancellationInterval.value = setInterval(incrementCancellationProgress, 25);
};

const createStore = () => {
  if (!formValid.value) return;

  creating.value = true;
  setStore({
    password: password.value,
    store: {
      created: Date.now(),
      exported: null,
      edited: null,
      records: [],
    },
  });
  setTimeout(() => notify({ type: "success", text: t("newStoreCreated") }), 1000);
};

const importStore = ({ target: { files } }) => {
  const archive = new JSZip();
  const { lastModified, name, size } = files[0];
  file.value.lastModified = lastModified;
  file.value.name = name;
  file.value.size = size;

  archive
    .loadAsync(files[0])
    .then(async zip => {
      unzippedStore.value = await zip.file("db").async("string");
    })
    .catch(() => notify({ type: "error", text: t("errorUnzipping") }));
};

watch(newStoreShown, () => {
  password.value = null;
  passwordConfirmation.value = null;
});
watch(unlockingAttemptsLeft, left => {
  left < 1 && setTimeout(clearCachedData, 1000);
});
watch(unlocking, async inProgress => {
  if (!inProgress || unlockingAttemptsLeft.value < 1) return;

  setTimeout(() => {
    try {
      const bytes = crypto.AES.decrypt(unzippedStore.value, passwordUnlock.value);
      decryptedStore.value = JSON.parse(bytes.toString(crypto.enc.Utf8));
      setTimeout(
        () =>
          setStore({
            password: passwordUnlock.value,
            store: decryptedStore.value,
          }),
        1000
      );
    } catch (err) {
      notify({ type: "error", text: t("errorUnlockingPassword") });
      unlockingAttemptsLeft.value -= 1;
      passwordUnlock.value = null;
      nextTick(() => passwordUnlockInput.value.$el.querySelector("input").focus());
      unlocking.value = false;
    }
  }, 1000);
});
watch(unzippedStore, cancelCancellation);
watch(cancel, () => cancel.value >= 100 && clearCachedData());

onUnmounted(stopUpdatingDates);
onClickOutside(cancelRangeInput, () => (cancel.value = 0));

const init = () => {
  restoreCachedStore();
  updateDates();
};
init();
</script>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<style scoped>
.no-store {
  box-shadow: 0 0.1rem 0 0.05rem theme("colors.primary");
}

.lockie-img {
  width: 3rem;
}

.dates li:not(:last-child):after {
  content: "﹡";
  font-size: 0.75em;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.animate-bob {
  animation-name: bob-float, bob;
  animation-duration: 0.3s, 1.5s;
  animation-delay: 0s, 0.3s;
  animation-timing-function: ease-out, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: forwards;
  animation-direction: normal, alternate;
}

.animate-rotate {
  animation: rotate 1s infinite;
}

@keyframes bob {
  0% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(-8px);
  }
}

@keyframes bob-float {
  100% {
    transform: translateY(-8px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(-360deg);
  }
  to {
    transform: none;
  }
}

@media screen and (min-width: 768px) {
  .lockie-img {
    width: 5rem;
  }
}
</style>
