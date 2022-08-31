import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import i18n from "@/i18n";
import { createRecord } from "@/store";

export const useNewPasswordCreation = () => {
  const newPasswordShown = ref(false);

  const create = record => {
    createRecord(record);
    newPasswordShown.value = false;
    notify({ type: "success", text: i18n.global.t("added") });
  };

  return { newPasswordShown, create };
};
