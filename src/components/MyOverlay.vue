<script setup lang="ts">
import { watch } from 'vue'

const isOpen = defineModel<boolean>('isOpen', { default: false })

withDefaults(
  defineProps<{
    darken?: boolean
  }>(),
  {
    darken: false,
  },
)

watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 w-full h-full z-50"
    :class="{ 'bg-neutral-900/20': darken }"
    @click="isOpen = false"
  >
    <slot />
  </div>
</template>
