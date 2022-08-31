<template>
  <ul class="my-0 pl-0 list-none flex">
    <li v-for="langOption in availableLocales" :key="langOption">
      <button
        type="button"
        class="border-none bg-none uppercase text-xs px-2 py-1"
        :class="langOption === locale ? 'text-primary' : 'text-gray-400 hover:opacity-70'"
        @click="setLocale(langOption)"
      >
        {{ langOption }}
      </button>
    </li>
  </ul>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import { useI18n } from "vue-i18n";

const { locale, availableLocales } = useI18n();

const setLocale = newLocale => {
  locale.value = newLocale;
  window.localStorage.setItem("locale", newLocale);
};
</script>
