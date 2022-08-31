import { ref, computed } from "vue";
import { DateTime } from "luxon";
import { STORE_CREATED, STORE_EDITED, STORE_EXPORTED } from "@/store";
import i18n from "@/i18n";

export const useDates = () => {
  const dates = ref([
    {
      milliseconds: null,
      relative: null,
      locale: null,
      intervalId: null,
      getter: STORE_CREATED,
      key: "created",
    },
    {
      milliseconds: null,
      relative: null,
      locale: null,
      intervalId: null,
      getter: STORE_EDITED,
      key: "edited",
    },
    {
      milliseconds: null,
      relative: null,
      locale: null,
      intervalId: null,
      getter: STORE_EXPORTED,
      key: "exported",
    },
  ]);

  const existingDates = computed(() => dates.value.filter(({ milliseconds }) => milliseconds));

  const updateDate = ({ date, updateMillisecondsFromStore } = {}) => {
    if (updateMillisecondsFromStore) date.milliseconds = date.getter;
    date.relative = date.milliseconds
      ? DateTime.fromMillis(date.milliseconds).toRelative()
      : i18n.global.t("never");
    date.locale = date.milliseconds ? new Date(date.milliseconds).toLocaleString() : null;
  };

  const updateDates = ({ updateMillisecondsFromStore } = {}) =>
    (updateMillisecondsFromStore ? dates : existingDates).value.forEach(date => {
      updateDate({ date, updateMillisecondsFromStore });
      date.intervalId = setInterval(() => updateDate({ date, updateMillisecondsFromStore }), 1000);
    });

  const stopUpdatingDates = () => {
    dates.value
      .filter(({ intervalId }) => intervalId)
      .forEach(({ intervalId }) => clearInterval(intervalId));
  };

  return {
    dates,
    existingDates,
    updateDates,
    stopUpdatingDates,
  };
};
