import crypto from "crypto-js";

import { ref, computed } from "vue";

const state = ref({
  mobileLeftMenuShown: false,
  mobileRightMenuShown: false,
  page: 1,
  label: null,
  password: null,
  store: null,
});

export const toggleMobileLeftMenu = shown => (state.value.mobileLeftMenuShown = shown);
export const toggleMobileRightMenu = shown => (state.value.mobileRightMenuShown = shown);
export const setPage = page => (state.value.page = page);
export const setStore = ({ password, store }) => {
  state.value.password = password;
  state.value.store = store;
};
export const setEditedDate = () => {
  const recordDates = state.value.store.records.map(({ created, edited, deleted }) =>
    Math.max(created, edited, deleted)
  );
  state.value.store.edited = recordDates.length ? Math.max(...recordDates) : null;
};
export const setExportedDate = date => (state.value.store.exported = date);
export const editRecordLabel = (oldLabel, newLabel) =>
  state.value.store.records.forEach(
    record =>
      record.labels.find(label => label === oldLabel) &&
      record.labels.splice(record.labels.indexOf(oldLabel), 1, newLabel)
  );
export const removeRecordLabel = labelForDeletion =>
  state.value.store.records.forEach(
    record => (record.labels = record.labels.filter(label => label !== labelForDeletion))
  );
export const setLabel = label => (state.value.label = label);
export const setPassword = password => (state.value.password = password);
export const endSession = () =>
  ["password", "search", "label", "store"].forEach(key => (state.value[key] = null));
export const createRecord = record => state.value.store.records.unshift(record);
export const deleteRecord = deletionRecordId => {
  const record = state.value.store.records.find(({ id }) => id === deletionRecordId);
  record.trash = true;
  record.deleted = Date.now();
};
export const restoreRecord = restorationRecordId => {
  const record = state.value.store.records.find(({ id }) => id === restorationRecordId);
  record.trash = false;
  record.deleted = null;
};
export const purgeRecord = purgeRecordId => {
  const record = state.value.store.records.find(({ id }) => id === purgeRecordId);
  state.value.store.records.splice(state.value.store.records.indexOf(record), 1);
};
export const editRecord = record =>
  state.value.store.records.splice(
    state.value.store.records.indexOf(state.value.store.records.find(({ id }) => id === record.id)),
    1,
    record
  );
export const cacheStore = () => {
  const encryptedStoreString = crypto.AES.encrypt(
    JSON.stringify(state.value.store),
    state.value.password
  ).toString();
  window.localStorage.setItem("store", encryptedStoreString);
  window.localStorage.setItem("created", JSON.stringify({ created: state.value.store.created }));
  state.value.store.edited &&
    window.localStorage.setItem("edited", JSON.stringify({ edited: state.value.store.edited }));
  state.value.store.exported &&
    window.localStorage.setItem(
      "exported",
      JSON.stringify({ exported: state.value.store.exported })
    );
};

export const MOBILE_LEFT_MENU_SHOWN = computed(() => state.value.mobileLeftMenuShown);
export const MOBILE_RIGHT_MENU_SHOWN = computed(() => state.value.mobileRightMenuShown);
export const STORE = computed(() => state.value.store);
export const PAGE = computed(() => state.value.page);
export const RECORDS = computed(() => state.value.store?.records);
export const LABEL = computed(() => state.value.label);
export const PASSWORD = computed(() => state.value.password);
export const STORE_CREATED = computed(() => state.value.store?.created);
export const STORE_EDITED = computed(() => state.value.store?.edited);
export const STORE_EXPORTED = computed(() => state.value.store?.exported);
export const UNIQUE_LABELS = computed(
  () =>
    state.value.store?.records
      .reduce((acc, current) => {
        current.labels.forEach(label => !acc.includes(label) && acc.push(label));
        return acc;
      }, [])
      .sort()
      .map(label => ({
        name: label,
        count: state.value.store.records.filter(({ labels }) => labels.includes(label)).length,
      })) || []
);
