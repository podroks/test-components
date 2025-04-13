<script setup lang="ts">
import { useTemplateRef } from 'vue'

withDefaults(
  defineProps<{
    label: string
  }>(),
  {
    label: 'Button',
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const rootRef = useTemplateRef<HTMLElement>('rootRef')

defineExpose({ rootRef })
</script>

<template>
  <button
    ref="rootRef"
    class="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-600 active:bg-blue-700"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
