<template>
    <div ref="inputContainerElement">
        <div class="w-full flex flex-col relative">
            <transition name="fade-zoom">
                <ul
                    v-if="strengthIndicator && modelValue && type === 'password'"
                    class="my-0 pl-0 list-none flex absolute top-full left-0"
                >
                    <li
                        v-for="index in 5"
                        :key="index"
                        class="flex transition-all duration-200"
                        :class="{
                            [`password-rating__${strength}`]: index - 1 <= strength,
                            'opacity-30': index - 1 > strength,
                            'password-rating-accent': index - 1 <= strength,
                        }"
                        :style="{ animationDelay: `${Math.random()}s` }"
                    >
                        <mdicon name="fire" :width="18" :height="18" />
                    </li>
                </ul>
            </transition>
            <label v-if="$slots.default" :for="randomId" class="block mb-1">
                <slot />
            </label>
            <div
                class="input"
                :class="{
                    'input--focus': focus,
                    'input--prefix': $slots.prefix,
                    'input--suffix': $slots.suffix,
                }"
            >
                <div class="flex-shrink-0">
                    <slot name="prefix" />
                </div>
                <textarea
                    v-if="props.textarea"
                    v-bind="$attrs"
                    :id="randomId"
                    ref="input"
                    :value="modelValue"
                    class="input__field"
                    rows="8"
                    @focus="focus = true"
                    @input="emit('update:modelValue', $event.target.value)"
                    @keyup.down="autocompleteList.length && $refs.autocomplete0.focus()"
                />
                <input
                    v-else
                    v-bind="$attrs"
                    :id="randomId"
                    ref="input"
                    :type="activeType"
                    :value="modelValue"
                    class="input__field"
                    @focus="focus = true"
                    @input="emit('update:modelValue', $event.target.value)"
                    @keyup.down="autocompleteList.length && $refs.autocomplete0.focus()"
                />
                <div
                    v-if="visibility || copyable || clearable || $slots.suffix"
                    class="flex flex-shrink-0"
                >
                    <transition name="fade-zoom">
                        <button
                            v-if="modelValue && clearable"
                            type="button"
                            class="hover:text-primary flex cursor-pointer p-0 opacity-70"
                            tabindex="-1"
                            @click="emit('clear')"
                        >
                            <transition name="fade-zoom" mode="out-in">
                                <mdicon name="close-circle-outline" :width="32" :height="18" />
                            </transition>
                        </button>
                    </transition>
                    <transition name="fade-zoom">
                        <button
                            v-if="modelValue && copyable"
                            type="button"
                            class="flex cursor-pointer p-0 opacity-70"
                            :class="copied ? 'text-green-600' : 'hover:text-primary'"
                            tabindex="-1"
                            @click="copyToClipboard(modelValue), (copied = true)"
                        >
                            <transition name="fade-zoom" mode="out-in">
                                <mdicon v-if="copied" name="check" :width="32" :height="18" />
                                <mdicon v-else name="content-copy" :width="32" :height="18" />
                            </transition>
                        </button>
                    </transition>
                    <slot name="suffix" />
                    <button
                        v-if="visibility"
                        type="button"
                        class="hover:text-primary flex cursor-pointer p-0 opacity-70"
                        tabindex="-1"
                        @click="visible = !visible"
                    >
                        <mdicon
                            :name="visible ? 'eye-outline' : 'eye-off-outline'"
                            :width="32"
                            :height="18"
                        />
                    </button>
                </div>
                <transition-group
                    v-if="autocompleteList.length && focus"
                    tag="ul"
                    class="absolute top-full inset-x-0 my-0 pl-0 list-none rounded overflow-hidden z-10"
                >
                    <li
                        v-for="(label, index) in filteredAutocompleteList"
                        :ref="`autocomplete${index}`"
                        :key="label"
                        :tabindex="0"
                        class="animate-fade-zoom opacity-0 input__autocomplete transition-all duration-100"
                        :style="{ animationDelay: `${index * 0.05}s` }"
                        @click="(focus = false), emit('autocomplete', label)"
                        @keyup.enter.space.stop="(focus = false), emit('autocomplete', label)"
                    >
                        {{ label }}
                    </li>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script setup>
import zxcvbn from 'zxcvbn'
import { onClickOutside } from '@vueuse/core'
import { computed, ref, watch, onMounted } from 'vue'
import { copyToClipboard } from '@/utility'

const randomId = `input_id_${ Math.random().toString(16).substring(3) }`

const props = defineProps({
    type: {
        type: String,
        default: 'text',
        validator: (type) => ['text', 'password'].includes(type),
    },
    autofocus: Boolean,
    copyable: Boolean,
    visibility: Boolean,
    clearable: Boolean,
    textarea: Boolean,
    strengthIndicator: Boolean,
    modelValue: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    autocompleteList: {
        type: Array,
        default: () => [],
    },
})
const emit = defineEmits(['update:modelValue', 'clear', 'autocomplete'])

const inputContainerElement = ref(null)
const focus = ref(false)
const copied = ref(false)
const visible = ref(false)
const input = ref(null)

const strength = computed(() => (props.modelValue ? zxcvbn(props.modelValue).score : 0))
const activeType = computed(() => (props.type === 'text' || visible.value ? 'text' : 'password'))
const filteredAutocompleteList = computed(() =>
    props.autocompleteList
        .filter(({ name }) =>
            name.toLowerCase().includes(props.modelValue ? props.modelValue.toLowerCase() : '')
        )
        .sort((prev, next) => (prev.count < next.count ? 1 : -1))
        .map(({ name }) => name)
        .slice(0, 5)
)

watch(copied, () => {
    if (!copied.value) return
    setTimeout(() => {
        copied.value = false
    }, 1000)
})

onMounted(() => props.autofocus && input.value.focus())
onClickOutside(inputContainerElement, () => (focus.value = false))
</script>

<style scoped>
.input {
    display: flex;
    position: relative;
    align-items: center;
    border-radius: var(--border-radius-default);
    box-shadow: 0 1rem 2rem -1.1rem rgba(0, 0, 0, 0.25);
    background-color: white;
    color: theme('colors.default');
    transition: all 0.1s;
    @media (prefers-color-scheme: dark) {
        background-color: rgba(255, 255, 255, 0.85);
    }
    &:not(.input--focus) {
        &:hover,
        &:focus {
            box-shadow: 0 0.75rem 2rem -1.1rem rgba(74, 140, 211, 0.65);
            @media (prefers-color-scheme: dark) {
                box-shadow: 0 1rem 2rem -1.1rem rgba(74, 140, 211, 0.75);
            }
        }
    }
    &:not(.input--prefix) {
        .input__field {
            padding-left: 0.8rem;
        }
    }
    &:not(.input--suffix) {
        .input__field {
            padding-right: 0.8rem;
        }
    }
    &.input--focus {
        box-shadow: 0 1rem 2rem -1.1rem rgba(74, 140, 211, 0.75);
        @media (prefers-color-scheme: dark) {
            box-shadow: 0 1rem 2rem -1.1rem rgba(58, 145, 239, 0.85);
        }
        .input__field {
            color: theme('colors.primary');
        }
    }
    &.input--prefix {
        .input__field {
            padding-left: 0;
        }
    }
    &.input--prefix {
        .input__field {
            padding-right: 0;
        }
    }
    &__field {
        width: 100%;
        display: block;
        flex-grow: 1;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        outline: none;
        font-size: 1rem;
        line-height: var(--line-height-default);
        color: theme('colors.default');
        border: none;
        background-color: transparent;
    }
    &__autocomplete {
        color: theme('colors.default');
        padding: 0.6rem 0.8rem;
        background-color: white;
        cursor: pointer;
        &:hover,
        &:focus {
            background-color: #ebf6ff;
            color: theme('colors.primary');
            outline: none;
        }
    }
}

.password-rating {
    &__0 {
        color: #2af0a4;
    }
    &__1 {
        color: #75e20f;
    }
    &__2 {
        color: #ffb200;
    }
    &__3 {
        color: #f98349;
    }
    &__4 {
        color: #ff5b5b;
    }
}

.password-rating-accent {
    animation-name: scale-up;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    transform-origin: center bottom;
}

@keyframes scale-up {
    0%,
    100% {
        transform: none;
    }
    50% {
        transform: scale(1.15);
    }
}
</style>
