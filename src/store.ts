import crypto from 'crypto-js'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
    const page = ref(1)
    const label = ref(null)
    const password = ref(null)
    const store = ref(null)

    const SET_PAGE = (n) => (page.value = n)
    const SET_STORE = (newPassword, newStore) => {
        password.value = newPassword
        store.value = newStore
    }
    const SET_EDITED_DATE = () => {
        const recordDates = store.value.records.map(({ created, edited, deleted }) =>
            Math.max(created, edited, deleted)
        )
        store.value.edited = recordDates.length ? Math.max(...recordDates) : null
    }
    const SET_EXPORTED_DATE = (date) => (store.value.exported = date)
    const EDIT_RECORD_LABEL = (oldLabel, newLabel) =>
        store.value.records.forEach(
            (record) =>
                record.labels.find((label) => label === oldLabel) &&
                record.labels.splice(record.labels.indexOf(oldLabel), 1, newLabel)
        )
    const REMOVE_RECORD_LABEL = (labelForDeletion) =>
        store.value.records.forEach(
            (record) =>
                (record.labels = record.labels.filter((label) => label !== labelForDeletion))
        )
    const SET_LABEL = (newLabel) => (label.value = newLabel)
    const SET_PASSWORD = (newPassword) => (password.value = newPassword)
    const END_SESSION = () => {
        password.value = null
        label.value = null
        store.value = null
    }
    const CREATE_RECORD = (record) => store.value.records.unshift(record)
    const DELETE_RECORD = (id) => {
        const recordToDelete = store.value.records.find((record) => record.id === id)
        recordToDelete.trash = true
        recordToDelete.deleted = Date.now()
    }
    const RESTORE_RECORD = (id) => {
        const recordToRestore = store.value.records.find((record) => record.id === id)
        recordToRestore.trash = false
        recordToRestore.deleted = null
    }
    const PURGE_RECORD = (id) => {
        const recordToPurge = store.value.records.find((record) => record.id === id)
        store.value.records.splice(store.value.records.indexOf(recordToPurge), 1)
    }
    const EDIT_RECORD = (record) =>
        store.value.records.splice(
            store.value.records.indexOf(store.value.records.find(({ id }) => id === record.id)),
            1,
            record
        )
    const CACHE_STORE = () => {
        const encryptedStoreString = crypto.AES.encrypt(
            JSON.stringify(store.value),
            password.value
        ).toString()
        window.localStorage.setItem('store', encryptedStoreString)
        window.localStorage.setItem('created', store.value.created)
        ;['edited', 'exported'].forEach((key) => window.localStorage.setItem(key, store.value[key]))
    }

    const STORE = computed(() => store.value)
    const PAGE = computed(() => page.value)
    const RECORDS = computed(() => store.value?.records)
    const LABEL = computed(() => label.value)
    const PASSWORD = computed(() => password.value)
    const STORE_CREATED = computed(() => store.value?.created)
    const STORE_EDITED = computed(() => store.value?.edited)
    const STORE_EXPORTED = computed(() => store.value?.exported)
    const UNIQUE_LABELS = computed(
        () =>
            store.value?.records
                .reduce((acc, current) => {
                    current.labels.forEach((label) => !acc.includes(label) && acc.push(label))
                    return acc
                }, [])
                .sort()
                .map((label) => ({
                    name: label,
                    count: store.value.records.filter(
                        ({ labels, trash }) => labels.includes(label) && !trash
                    ).length,
                })) || []
    )

    return {
        SET_PAGE,
        SET_STORE,
        SET_EDITED_DATE,
        SET_EXPORTED_DATE,
        EDIT_RECORD_LABEL,
        REMOVE_RECORD_LABEL,
        SET_LABEL,
        SET_PASSWORD,
        END_SESSION,
        CREATE_RECORD,
        DELETE_RECORD,
        RESTORE_RECORD,
        PURGE_RECORD,
        EDIT_RECORD,
        CACHE_STORE,
        STORE,
        PAGE,
        RECORDS,
        LABEL,
        PASSWORD,
        STORE_CREATED,
        STORE_EDITED,
        STORE_EXPORTED,
        UNIQUE_LABELS,
    }
})
