import { nextTick } from "vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/i18n.js";
import { STORE, setExportedDate, setStore } from "@/store";

const getOptionalLeadingStringZero = string => {
  const str = string.toString();
  return str.toString().length < 2 ? `0${str}` : str.toString();
};

export const exportStore = () => {
  const backupStore = { ...STORE };
  setExportedDate(Date.now());

  nextTick(async () => {
    try {
      const encryptedStoreString = window.localStorage.getItem("store");
      const zip = new JSZip();
      const date = new Date();

      const formattedDate = `${date.getFullYear()}-${getOptionalLeadingStringZero(
        date.getMonth() + 1
      )}-${getOptionalLeadingStringZero(date.getDate())}`;
      const formattedTime = `${getOptionalLeadingStringZero(
        date.getHours()
      )}-${getOptionalLeadingStringZero(date.getMinutes())}-${getOptionalLeadingStringZero(
        date.getSeconds()
      )}`;

      const zipFilename = `store_${formattedDate}@${formattedTime}.lockie`;

      zip.file("db", encryptedStoreString);

      saveAs(
        await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9,
          },
        }),
        zipFilename
      );
      notify({ type: "success", text: i18n.global.t("exported") });
    } catch (error) {
      setStore(backupStore);
      notify({ type: "error", text: error });
    }
  });
};