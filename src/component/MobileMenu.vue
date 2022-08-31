<template>
  <header class="fixed top-0 left-0 right-0 flex flex-col z-10">
    <div class="mobile-menu flex justify-between">
      <button
        type="button"
        :class="{ 'menu-btn--active': MOBILE_LEFT_MENU_SHOWN }"
        class="menu-btn p-0 w-16 h-16 flex justify-center items-center"
        @click="toggle('left')"
      >
        <menu-icon class="h-5" />
      </button>
      <button
        type="button"
        :class="{ 'menu-btn--active': MOBILE_RIGHT_MENU_SHOWN }"
        class="menu-btn p-0 w-16 h-16 flex justify-center items-center"
        @click="toggle('right')"
      >
        <submenu-icon class="h-6" />
      </button>
    </div>
    <transition name="fade-zoom" mode="out-in">
      <the-sidebar v-if="MOBILE_LEFT_MENU_SHOWN" class="mobile-menu__panel overflow-auto" />
      <div
        v-else-if="MOBILE_RIGHT_MENU_SHOWN"
        class="bg-gradient-radial-gray flex flex-col mobile-menu__panel justify-between overflow-auto py-8"
      >
        <div class="grid gap-8">
          <div
            class="flex relative btn-indicator col-span-12 mt-8 mx-8"
            :class="{ 'btn-indicator--active': newPasswordShown }"
          >
            <button
              type="button"
              class="btn btn--primary w-full relative z-10"
              @click="(settingsShown = false), (newPasswordShown = !newPasswordShown)"
            >
              <span class="flex mr-2">
                <mdicon name="lock-plus-outline" :size="18" />
              </span>
              {{ t("newPassword") }}
            </button>
          </div>
          <transition name="fade-zoom" mode="out-in">
            <record-edit
              v-if="newPasswordShown"
              class="py-16 relative col-span-12"
              @cancel="newPasswordShown = false"
              @create="create"
            />
          </transition>
          <button
            :disabled="!RECORDS.length"
            type="button"
            class="btn btn--primary col-span-12 mx-8"
            @click="exportStore"
          >
            <span class="flex mr-2">
              <mdicon name="database-export-outline" :size="18" />
            </span>
            {{ t("export") }}
          </button>
          <div
            class="flex relative btn-indicator col-span-12 mx-8"
            :class="{ 'btn-indicator--active': settingsShown }"
          >
            <button
              type="button"
              class="btn btn--alt w-full"
              @click="(newPasswordShown = false), (settingsShown = !settingsShown)"
            >
              {{ t("settings") }}
            </button>
          </div>
          <transition name="fade-zoom" mode="out-in">
            <div v-if="settingsShown" class="py-16 col-span-12">
              <the-settings @close="settingsShown = false" />
            </div>
          </transition>
        </div>
        <button type="button" class="btn btn--alt mx-8" @click="endSession()">
          {{ t("shutdown") }}
        </button>
      </div>
    </transition>
  </header>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { exportStore } from "@/utility";
import {
  RECORDS,
  MOBILE_LEFT_MENU_SHOWN,
  MOBILE_RIGHT_MENU_SHOWN,
  endSession,
  toggleMobileLeftMenu,
  toggleMobileRightMenu,
} from "@/store";
import TheSidebar from "@/component/TheSidebar.vue";
import RecordEdit from "@/component/RecordEdit.vue";
import TheSettings from "@/component/TheSettings.vue";
import MenuIcon from "@/icon/menu.svg";
import SubmenuIcon from "@/icon/submenu.svg";
import { usePassword } from "@/mixin";

const { t } = useI18n();

const bodyElement = document.querySelector("body");

const { newPasswordShown, create } = usePassword();

const settingsShown = ref(false);

const toggle = side => {
  switch (side) {
    case "left":
      toggleMobileLeftMenu(!MOBILE_LEFT_MENU_SHOWN.value);
      toggleMobileRightMenu(false);
      return;
    default:
      toggleMobileRightMenu(!MOBILE_RIGHT_MENU_SHOWN.value);
      toggleMobileLeftMenu(false);
  }
};

watch([MOBILE_LEFT_MENU_SHOWN, MOBILE_RIGHT_MENU_SHOWN], () => {
  MOBILE_LEFT_MENU_SHOWN.value || MOBILE_RIGHT_MENU_SHOWN.value
    ? bodyElement.classList.add("overflow-hidden")
    : bodyElement.classList.remove("overflow-hidden");
});
</script>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<style scoped>
.mobile-menu {
  background: linear-gradient(45deg, rgba(74, 140, 211, 1) 0%, rgba(48, 158, 209, 1) 100%);
  &__panel {
    height: calc(100vh - 4rem);
  }
}

.menu-btn {
  &.menu-btn--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
