<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { notify } from '@kyvg/vue3-notification'
import { ref, watch, computed } from 'vue'
import { vTooltip } from 'floating-vue'
import { useStore } from '@/store'
import copyToClipboard from '@/utilities/copyToClipboard'
import RecordEdit from "@/components/RecordEdit.vue"
import BaseIcon from "@/components/BaseIcon.vue"

const { t } = useI18n()
const store = useStore()
const { DELETE_RECORD, EDIT_RECORD, RESTORE_RECORD, PURGE_RECORD } = store

const props = defineProps({
    record: {
        type: Object,
        required: true,
        default: () => ({}),
    },
})

const titleCopied = ref(false)
const loginCopied = ref(false)
const passwordCopied = ref(false)
const passwordVisible = ref(false)
const detailsShown = ref(false)

const isTitleUrl = computed(() => URL.canParse(props.record.title))
const formattedPassword = computed(() =>
    passwordVisible.value
        ? props.record.password
        : props.record.password
              .split('')
              .map(() => '٭')
              .join('')
)

watch(titleCopied, (copied) => copied && setTimeout(() => (titleCopied.value = false), 1000))
watch(loginCopied, (copied) => copied && setTimeout(() => (loginCopied.value = false), 1000))
watch(passwordCopied, (copied) => copied && setTimeout(() => (passwordCopied.value = false), 1000))

const save = (record) => {
    EDIT_RECORD(record)
    detailsShown.value = false
    notify({ type: 'success', text: t('saved') })
}
const remove = (id) => {
    DELETE_RECORD(id)
    detailsShown.value = false
    notify({ type: 'success', text: t('deleted') })
}
const restore = (id) => {
    RESTORE_RECORD(id)
    detailsShown.value = false
    notify({ type: 'success', text: t('restored') })
}
const purge = (id) => {
    PURGE_RECORD(id)
    detailsShown.value = false
    notify({ type: 'success', text: t('purged') })
}
</script>

<template>
    <div class="record border-b border-gray-200 dark:border-white dark:border-opacity-5">
        <div class="record-row record grid grid-cols-12 gap-x-8 py-8 xl:py-0">
            <div class="col-span-12 xl:col-span-3 py-4 px-4" :title="record.title">
                <div class="xl:hidden text-sm text-gray-400">{{ t('title') }}</div>

                <div class="flex">
                    <div :class="{ 'truncate min-w-0': isTitleUrl }">{{ record.title }}</div>

                    <div v-if="isTitleUrl" class="record-action ml-2 mt-1">
                        <div class="flex gap-x-2.5">
                            <button
                                type="button"
                                class="flex cursor-pointer p-0 opacity-70"
                                :class="titleCopied ? 'text-green-600' : 'hover:text-primary'"
                                tabindex="-1"
                                @click="copyToClipboard(record.title), (titleCopied = true)"
                            >
                                <Transition name="fade-zoom" mode="out-in">
                                    <BaseIcon
                                        v-if="titleCopied"
                                        class="w-4"
                                        name="check"
                                        v-tooltip="t('copied')"
                                    />

                                    <BaseIcon
                                        v-else
                                        class="w-4"
                                        name="copy"
                                        v-tooltip="t('copy')"
                                    />
                                </Transition>
                            </button>

                            <a
                                :href="record.title"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex-shrink-0 text-default dark:text-lite hover:text-primary opacity-70"
                                tabindex="-1"
                            >
                                <BaseIcon
                                    class="w-4"
                                    name="external-link"
                                    v-tooltip="t('openInNewTab')"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 xl:col-span-3 py-4 px-4">
                <div class="xl:hidden text-sm text-gray-400">{{ t('login') }}</div>

                <div class="flex">
                    <div class="break-all">{{ record.login }}</div>

                    <div class="record-action ml-2 mt-1">
                        <div class="flex">
                            <button
                                type="button"
                                class="flex cursor-pointer p-0 opacity-70"
                                :class="loginCopied ? 'text-green-600' : 'hover:text-primary'"
                                tabindex="-1"
                                @click="copyToClipboard(record.login), (loginCopied = true)"
                            >
                                <Transition name="fade-zoom" mode="out-in">
                                    <BaseIcon
                                        v-if="loginCopied"
                                        class="w-4"
                                        name="check"
                                        v-tooltip="t('copied')"
                                    />

                                    <BaseIcon
                                        v-else
                                        class="w-4"
                                        name="copy"
                                        v-tooltip="t('copy')"
                                    />
                                </Transition>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 xl:col-span-3 py-4 px-4">
                <div class="xl:hidden text-sm text-gray-400">{{ t('password') }}</div>

                <div class="flex">
                    <div class="break-all">{{ formattedPassword }}</div>

                    <div class="record-action ml-2 mt-1">
                        <div class="flex gap-x-2.5">
                            <button
                                type="button"
                                class="flex cursor-pointer p-0 opacity-70"
                                :class="passwordCopied ? 'text-green-600' : 'hover:text-primary'"
                                tabindex="-1"
                                @click="copyToClipboard(record.password), (passwordCopied = true)"
                            >
                                <Transition name="fade-zoom" mode="out-in">
                                    <BaseIcon
                                        v-if="passwordCopied"
                                        class="w-4"
                                        name="check"
                                        v-tooltip="t('copied')"
                                    />

                                    <BaseIcon
                                        v-else
                                        class="w-4"
                                        name="copy"
                                        v-tooltip="t('copy')"
                                    />
                                </Transition>
                            </button>

                            <button
                                type="button"
                                class="hover:text-primary flex cursor-pointer p-0 opacity-70"
                                tabindex="-1"
                                @click="passwordVisible = !passwordVisible"
                            >
                                <BaseIcon
                                    v-if="passwordVisible"
                                    class="w-4"
                                    name="eye-slash"
                                    v-tooltip="t('hidePassword')"
                                />

                                <BaseIcon
                                    v-else
                                    class="w-4"
                                    name="eye"
                                    v-tooltip="t('showPassword')"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 xl:col-span-3 py-4 px-4">
                <div class="xl:hidden text-sm text-gray-400">{{ t('notes') }}</div>

                <div class="flex justify-between">
                    <div class="max-h-80 overflow-auto whitespace-pre-wrap">{{ record.notes || '-' }}</div>

                    <div class="record-action flex ml-2 mt-1">
                        <button
                            type="button"
                            class="hover:text-primary flex cursor-pointer p-0 opacity-70"
                            tabindex="-1"
                            @click="detailsShown = !detailsShown"
                        >
                            <BaseIcon
                                class="w-4"
                                name="edit"
                                v-tooltip="t('edit')"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="fade-zoom">
            <RecordEdit
                v-if="detailsShown"
                :record="record"
                class="col-span-12"
                @cancel="detailsShown = false"
                @save="save"
                @remove="remove"
                @restore="restore"
                @purge="purge"
            />
        </Transition>
    </div>
</template>

<style scoped>
.record {
    &:hover {
        .record-action {
            opacity: 1;
        }

        .record-row {
            background-color: rgba(0, 0, 0, 0.025);

            :root.dark & {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
}

.record-action {
    opacity: 0;
}

.record-row {
    transition: background-color 0.15s;
}
</style>
