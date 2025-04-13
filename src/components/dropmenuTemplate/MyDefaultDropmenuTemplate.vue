<script setup lang="ts">
import { computed } from 'vue'
import type { DropmenuClickEvent, DropmenuOption, DropmenuSelect } from '../MyDropmenu.vue'

const props = withDefaults(
  defineProps<{
    option: DropmenuOption
    select?: DropmenuSelect | Array<DropmenuSelect>
    nestedPath?: Array<string>
  }>(),
  {
    nestedPath: () => [],
  },
)

const emit = defineEmits<{
  (e: 'click', props: DropmenuClickEvent): void
}>()

const isSelected = computed(() => {
  if (!props.select) return false
  if (Array.isArray(props.select)) {
    return props.select.includes([...props.nestedPath, props.option.value].join('.'))
  }
  return props.select === [...props.nestedPath, props.option.value].join('.')
})

function onClick() {
  emit('click', { value: props.option.value, nestedPath: props.nestedPath })
}
</script>

<template>
  <div
    class="flex items-center px-4 py-2"
    :class="{ 'hover:bg-neutral-200 cursor-pointer': option.value, 'bg-neutral-200': isSelected }"
    @click="onClick"
  >
    <span class="truncate">
      {{ option.label }}
    </span>
  </div>
</template>
