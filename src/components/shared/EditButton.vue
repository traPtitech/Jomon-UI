<script lang="ts" setup>
import { PencilIcon, XMarkIcon } from '@heroicons/vue/24/solid'

withDefaults(
  defineProps<{
    isEditMode: boolean
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
      class="text-secondary hover:text-secondaryHover h-4 w-4" />
    <XMarkIcon
      v-else
      class="text-secondary hover:text-secondaryHover h-4 w-4" />
  </button>
</template>
