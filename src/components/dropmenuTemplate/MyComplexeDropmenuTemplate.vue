<script setup lang="ts">
import { computed } from 'vue'
import type { DropmenuClickEvent, DropmenuOption, DropmenuSelect } from '../MyDropmenu.vue'

const props = withDefaults(
  defineProps<{
    option: DropmenuOption & {
      title: string
      subtitle: string
    }
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
    class="flex items-start justify-between px-4 py-2 gap-8"
    :class="{ 'hover:bg-neutral-200 cursor-pointer': option.value, 'bg-neutral-200': isSelected }"
    @click="onClick"
  >
    <div class="flex flex-col">
      <span class="truncate font-bold">{{ option.title }}</span>
      <span class="truncate text-xs text-neutral-600">{{ option.subtitle }}</span>
    </div>
    <div>
      <span class="truncate text-xs bg-blue-900 text-white rounded-full px-2 pb-0.5">En cours</span>
    </div>
  </div>
</template>
