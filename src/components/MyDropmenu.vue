<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { useFloating } from '@/composables/useFloating'
import MyOverlay from './MyOverlay.vue'
import MyDefaultDropmenuTemplate from './dropmenuTemplate/MyDefaultDropmenuTemplate.vue'
import MyNestedDropmenuTemplate from './dropmenuTemplate/MyNestedDropmenuTemplate.vue'

export type DropmenuOption = {
  is?: Component
  label?: string
  value: string
  children?: Array<DropmenuOption>
}

export type DropmenuSelect = string

export type DropmenuClickEvent = {
  value: string
  nestedPath: Array<string>
}

export type DropmenuNestedClickEvent = DropmenuClickEvent & {
  isOpen: boolean
}

const isOpen = defineModel<boolean>('isOpen', { default: false })

const props = withDefaults(
  defineProps<{
    darken?: boolean
    options: Array<DropmenuOption>
    select?: DropmenuSelect | Array<DropmenuSelect>
    triggerRef: HTMLElement | null | undefined
    placement?:
      | 'top'
      | 'top-left'
      | 'top-right'
      | 'bottom'
      | 'bottom-left'
      | 'bottom-right'
      | 'left'
      | 'left-top'
      | 'left-bottom'
      | 'right'
      | 'right-top'
      | 'right-bottom'
    offsetFromTrigger?: number
    offsetFromWindow?: number
    offsetNestedAlignment?: number
    isNested?: boolean
    nestedPath?: Array<string>
  }>(),
  {
    darken: false,
    offsetFromTrigger: 0,
    offsetFromWindow: 16,
    placement: 'bottom',
    isNested: false,
    nestedPath: () => [],
  },
)

const emit = defineEmits<{
  (e: 'click', props: DropmenuClickEvent): void
  (e: 'click:nested', props: DropmenuNestedClickEvent): void
}>()

const dropmenuRef = ref<HTMLElement | null>(null)

const { adjustedPlacement, left, top, maxHeight, maxWidth, updatePositioningData } = useFloating(
  computed(() => props.triggerRef ?? null),
  dropmenuRef,
  {
    placement: computed(() => props.placement),
    offsetFromTrigger: props.offsetFromTrigger,
    offsetFromWindow: props.offsetFromWindow,
    offsetAlignment: props.isNested ? props.offsetNestedAlignment : 0,
    canUpdatePositioningData: isOpen,
  },
)

watch(
  () => adjustedPlacement,
  (newValue) => {
    console.log('placement', newValue)
  },
)

watch(
  () => isOpen.value,
  (newValue) => {
    if (newValue) {
      updatePositioningData()
    }
  },
)

function automaticIs(option: DropmenuOption) {
  if (option.children) {
    return MyNestedDropmenuTemplate
  }

  return MyDefaultDropmenuTemplate
}

function onClick(event: DropmenuClickEvent) {
  emit('click', event)
}
function onClickNested(event: DropmenuNestedClickEvent) {
  emit('click:nested', event)
}
</script>

<template>
  <template v-if="!props.isNested">
    <!-- Ajouter un uuid pour l'id -->
    <MyOverlay v-model:isOpen="isOpen" id="my-overlay" :darken>
      <div
        ref="dropmenuRef"
        class="dropmenu-positioning absolute rounded bg-neutral-100 overflow-auto shadow-neutral-500 shadow-md"
        :style="{
          top: `${top}rem`,
          left: `${left}rem`,
          'max-height': `${maxHeight}rem`,
          'max-width': `${maxWidth}rem`,
        }"
        @click.stop
      >
        <component
          v-for="option in options"
          :key="option.value"
          :is="option.is ?? automaticIs(option)"
          :option
          :select
          :nested-path
          :placement="adjustedPlacement"
          :offset-from-trigger="props.offsetFromTrigger"
          :offset-from-window="props.offsetFromWindow"
          :offset-nested-alignment="props.offsetNestedAlignment"
          @click="onClick"
          @click:nested="onClickNested"
        />
      </div>
    </MyOverlay>
  </template>
  <template v-else>
    <Teleport defer to="#my-overlay">
      <div
        v-if="isOpen"
        ref="dropmenuRef"
        class="dropmenu-positioning absolute rounded bg-neutral-100 overflow-auto shadow-neutral-500 shadow-md"
        :style="{
          top: `${top}rem`,
          left: `${left}rem`,
          'max-height': `${maxHeight}rem`,
          'max-width': `${maxWidth}rem`,
        }"
        @click.stop
      >
        <component
          v-for="option in options"
          :key="option.value"
          :is="option.is ?? automaticIs(option)"
          :option
          :select
          :nested-path
          :placement="adjustedPlacement"
          :offset-from-trigger="props.offsetFromTrigger"
          :offset-from-window="props.offsetFromWindow"
          :offset-nested-alignment="props.offsetNestedAlignment"
          @click="onClick"
          @click:nested="onClickNested"
        />
      </div>
    </Teleport>
  </template>
</template>
