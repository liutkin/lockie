<template>
  <div class="pt-16 lg:pt-0">
    <mobile-menu v-if="STORE" class="lg:hidden" />
    <the-sidebar class="w-80 hidden lg:flex flex-column fixed top-0 bottom-0 left-0" />
    <record-list ref="recordsElement" />
    <transition name="slide-up" mode="out-in">
      <no-store v-if="!STORE" />
    </transition>
    <notifications position="bottom right" />
  </div>
  <reload-prompt />
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import scrollIntoView from "scroll-into-view";
import { ref, watch } from "vue";
import {
  STORE,
  LABEL,
  PAGE,
  PASSWORD,
  setEditedDate,
  cacheStore,
  toggleMobileLeftMenu,
  toggleMobileRightMenu,
} from "@/store";

const recordsElement = ref(null);

watch(
  [STORE, PASSWORD],
  () => {
    if (!STORE.value) return;
    toggleMobileLeftMenu(false);
    toggleMobileRightMenu(false);
    setEditedDate();
    cacheStore();
  },
  { immediate: true, deep: true }
);
watch(LABEL, () => {
  toggleMobileLeftMenu(false);
  toggleMobileRightMenu(false);
});
watch([LABEL, PAGE], () =>
  scrollIntoView(recordsElement.value.$el.parentNode, { align: { top: 0 } })
);
</script>
