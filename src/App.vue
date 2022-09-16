<template>
  <div class="pt-12 lg:pt-0">
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

<script setup>
import scrollIntoView from "scroll-into-view";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/store";

const store = useStore();
const { STORE, LABEL, PAGE, PASSWORD } = storeToRefs(store);
const { SET_EDITED_DATE, CACHE_STORE } = store;

const recordsElement = ref(null);

watch(
  [STORE, PASSWORD],
  () => {
    if (!STORE.value) return;

    SET_EDITED_DATE();
    CACHE_STORE();
  },
  { deep: true }
);
watch([LABEL, PAGE], () =>
  scrollIntoView(recordsElement.value.$el.parentNode, { align: { top: 0 } })
);
</script>
