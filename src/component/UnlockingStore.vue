<template>
  <form class="relative" @submit.prevent="unlocking = true">
    <div class="absolute opacity-70 bottom-full left-1/2 transform -translate-x-1/2 mb-8">
      <div class="flex" :class="{ 'animate-bob': unlockingAttemptsLeft === 3 && !decryptedStore }">
        <lock-good-icon v-if="decryptedStore" class="w-12 md:w-20 fill-current" />
        <component v-else :is="lockIcon" class="w-12 md:w-20 fill-current" />
        <transition name="fade-zoom"
          ><b v-if="unlockingAttemptsLeft === 3 && !decryptedStore" class="absolute top-0 left-full"
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
            class="my-0 pl-0 list-none flex flex-wrap items-center text-xs"
          >
            <li v-for="date in existingDates" :key="date.key" :title="date.local">
              {{ t(date.key) }}: {{ date.relative }}
            </li>
          </ul>
        </div>
        <div class="flex opacity-70 ml-4">
          <lock-mechanism-icon class="h-14 fill-current" :class="{ 'animate-rotate': unlocking }" />
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
          class="btn btn--alt col-span-12 order-1 lg:order-none"
          @click="emit('cancel')"
        >
          {{ t("cancel") }}
        </button>
        <button :disabled="!passwordUnlock || unlocking" class="btn btn--primary col-span-12">
          <span class="flex mr-2">
            <mdicon
              :name="unlocking ? 'lock-open-variant-outline' : 'lock-open-outline'"
              :size="18"
            />
          </span>
          {{ unlocking ? `${t("unlocking")}...` : t("unlock") }}
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
</template>

<script setup>
import crypto from "crypto-js";
import { onClickOutside } from "@vueuse/core";
import { notify } from "@kyvg/vue3-notification";
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import { useStore } from "@/store";
import { useDates } from "@/mixin";
import { useI18n } from "vue-i18n";
import LockGoodIcon from "@/icon/lock-good.svg";
import LockWaitingIcon from "@/icon/lock-waiting.svg";
import LockBad1Icon from "@/icon/lock-bad-1.svg";
import LockBad2Icon from "@/icon/lock-bad-2.svg";
import LockBad3Icon from "@/icon/lock-bad-3.svg";
import LockMechanismIcon from "@/icon/lock-mechanism.svg";

const { t } = useI18n();
const store = useStore();
const { SET_STORE } = store;

const props = defineProps({
  unzippedStore: {
    type: String,
    required: true,
    default: "",
  },
});

const emit = defineEmits(["cancel", "clear"]);

const { dates, existingDates, updateDates, stopUpdatingDates } = useDates([
  { key: "created" },
  { key: "edited" },
  { key: "exported" },
]);

const lockAttemptsIconTable = {
  0: LockBad3Icon,
  1: LockBad2Icon,
  2: LockBad1Icon,
  3: LockWaitingIcon,
  default: LockBad3Icon,
};

const unlocking = ref(false);
const cancellationProgress = ref(0);
const cancellationInterval = ref(null);
const cancel = ref(0);
const cancelRangeInput = ref(null);
const passwordUnlockInput = ref(null);
const passwordUnlock = ref(null);
const unlockingAttemptsLeft = ref(3);
const decryptedStore = ref(null);

const lockIcon = computed(
  () => lockAttemptsIconTable[unlockingAttemptsLeft.value] || lockAttemptsIconTable.default
);

const clear = () => {
  dates.value.forEach(date => {
    window.localStorage.removeItem(date.key);
    clearInterval(date.intervalId);
  });
  emit("clear");
};

const cancelCancellation = () => {
  clearInterval(cancellationInterval.value);
  cancellationInterval.value = null;
  cancellationProgress.value = 0;
};

const incrementCancellationProgress = () => {
  if (cancellationProgress.value >= 100) {
    cancelCancellation();
    clear();
    return;
  }
  cancellationProgress.value += 2;
};

const startCancellation = () => {
  incrementCancellationProgress();
  cancellationInterval.value = setInterval(incrementCancellationProgress, 25);
};

const restoreCachedDates = () =>
  dates.value.forEach(
    date => (date.milliseconds = parseInt(window.localStorage.getItem(date.key)) || null)
  );

watch(unlocking, async inProgress => {
  if (!inProgress || unlockingAttemptsLeft.value < 1) return;

  setTimeout(() => {
    try {
      const bytes = crypto.AES.decrypt(props.unzippedStore, passwordUnlock.value);
      decryptedStore.value = JSON.parse(bytes.toString(crypto.enc.Utf8));
      setTimeout(() => SET_STORE(passwordUnlock.value, decryptedStore.value), 1000);
    } catch (err) {
      notify({ type: "error", text: t("errorUnlockingPassword") });
      unlockingAttemptsLeft.value -= 1;
      passwordUnlock.value = null;
      nextTick(() => passwordUnlockInput.value.$el.querySelector("input").focus());
      unlocking.value = false;
    }
  }, 1000);
});
watch(unlockingAttemptsLeft, left => left < 1 && setTimeout(clear, 1000));
watch(cancel, () => cancel.value >= 100 && clear());

onClickOutside(cancelRangeInput, () => (cancel.value = 0));

onUnmounted(stopUpdatingDates);

restoreCachedDates();
updateDates();
</script>

<style scoped>
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

li {
  &:not(:last-child) {
    &:after {
      content: "﹡";
      font-size: 0.75em;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
}

@keyframes bob {
  0% {
    transform: translateY(-0.5rem);
  }
  50% {
    transform: translateY(-0.25rem);
  }
  100% {
    transform: translateY(-0.5rem);
  }
}

@keyframes bob-float {
  100% {
    transform: translateY(-0.5rem);
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
</style>
