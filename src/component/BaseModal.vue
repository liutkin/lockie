<template>
  <teleport to="body">
    <transition name="fade-zoom" mode="out-in">
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-30 bg-gradient-radial-dark flex justify-center items-center"
      >
        <div ref="modal" class="w-[40rem] max-w-[90vw] rounded overflow-hidden">
          <slot name="content" />
          <slot name="action" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core/index";
import { ref, watchEffect } from "vue";

const bodyElement = document.querySelector("body");

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const modal = ref(null);

const handleBodyOverflow = () =>
  props.modelValue.value
    ? bodyElement.classList.add("overflow-hidden")
    : bodyElement.classList.remove("overflow-hidden");

onClickOutside(modal, () => emit("update:modelValue", false));
watchEffect(handleBodyOverflow);
</script>
