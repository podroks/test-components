<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type {
  DropmenuClickEvent,
  DropmenuNestedClickEvent,
  DropmenuOption,
  DropmenuSelect,
} from '../MyDropmenu.vue'
import MyDropmenu from '../MyDropmenu.vue'
import type { Placement } from '@/composables/useFloating'

const props = withDefaults(
  defineProps<{
    option: DropmenuOption & {
      children: Array<DropmenuOption>
    }
    select?: DropmenuSelect | Array<DropmenuSelect>
    nestedPath?: Array<string>
    placement: Placement
    offsetFromTrigger: number
    offsetFromWindow: number
    offsetNestedAlignment: number
  }>(),
  {
    nestedPath: () => [],
  },
)

const emit = defineEmits<{
  (e: 'click', props: DropmenuClickEvent): void
  (e: 'click:nested', props: DropmenuNestedClickEvent): void
}>()

const myNestedDropmenuIsOpen = ref(false)
const myTriggerRef = ref<HTMLElement | null>(null)

const adjustedPlacement = computed(() => {
  if (props.placement.startsWith('top') || props.placement.startsWith('bottom')) {
    return props.placement
  }
  if (props.placement.startsWith('left')) {
    return 'left-top'
  }
  return 'right-top'
})

watch(
  () => adjustedPlacement.value,
  (newVal) => {
    console.log('adjustedPlacement', newVal, props.placement)
  },
)

function onClick(event: DropmenuClickEvent) {
  emit('click', event)
}
function onClickNested(event: DropmenuNestedClickEvent) {
  emit('click:nested', event)
}
function onClickCurrentNested() {
  myNestedDropmenuIsOpen.value = !myNestedDropmenuIsOpen.value
  onClickNested({
    value: props.option.value,
    isOpen: myNestedDropmenuIsOpen.value,
    nestedPath: props.nestedPath,
  })
}
</script>

<template>
  <div
    ref="myTriggerRef"
    class="flex items-center px-4 py-2 hover:bg-neutral-200 cursor-pointer"
    :class="{ 'bg-neutral-200': myNestedDropmenuIsOpen }"
    @click="onClickCurrentNested"
  >
    <span class="truncate">
      {{ option.label }}
    </span>
    <span>{{ myNestedDropmenuIsOpen ? '>' : '<' }}</span>
  </div>
  <MyDropmenu
    v-model:isOpen="myNestedDropmenuIsOpen"
    :options="option.children"
    :select
    :trigger-ref="myTriggerRef"
    :placement="adjustedPlacement"
    :offset-from-trigger
    :offset-from-window
    :offset-nested-alignment
    is-nested
    :nested-path="[...nestedPath, option.value]"
    @click="onClick"
    @click:nested="onClickNested"
  />
</template>
