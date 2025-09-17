<script lang="ts" setup>
import { PencilIcon, XMarkIcon } from '@heroicons/vue/24/solid'

withDefaults(
  defineProps<{
    isEditMode?: boolean
  }>(),
  {
    isEditMode: false
  }
)
</script>

<template>
  <button class="inline-block">
    <PencilIcon
      v-if="!isEditMode"
      class="h-4 w-4 text-text-secondary hover:text-text-primary" />
    <XMarkIcon v-else class="text-secondary h-4 w-4 hover:text-text-primary" />
  </button>
</template>
