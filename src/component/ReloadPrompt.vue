<template>
  <transition name="fade-zoom" mode="out-in">
    <div
      v-if="offlineReady || needRefresh"
      class="fixed right-0 bottom-0 m-4 p-4 rounded z-20 bg-white filter drop-shadow"
      role="alert"
    >
      <div>
        {{ offlineReady ? t("readyToOffline") : t("newContentAvailable") }}
      </div>
      <div class="flex justify-end items-center mt-4">
        <button class="btn btn--alt btn--sm mr-2" @click="close">{{ t("close") }}</button>
        <button v-if="needRefresh" class="btn btn--primary btn--sm" @click="updateServiceWorker()">
          {{ t("reload") }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRegisterSW } from "virtual:pwa-register/vue";

const { t } = useI18n();
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>
