<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGeneralStore } from '/@/stores/general'

type Props = { size: 'sm' | 'md'; layer: number }
const props = defineProps<Props>()

const generalStore = useGeneralStore()
const { isModalOpen, isModalOpen2 } = storeToRefs(generalStore)
const size = () => {
  switch (props.size) {
    case 'sm':
      return 'h-80 w-160'
    case 'md':
      return 'h-150 w-300'
  }
}
</script>

<template>
  <div
    v-if="props.layer === 1"
    :class="
      isModalOpen ? 'fixed top-0 h-screen w-screen z-2 bg-gray-500/50' : ''
    "
    @click.self="isModalOpen = false">
    <div
      :class="`bg-white absolute z-3 inset-0 m-auto overflow-y-scroll ${size()}`">
      <slot />
    </div>
  </div>
  <div
    v-if="props.layer === 2"
    :class="
      isModalOpen2 ? 'fixed top-0 h-screen w-screen z-4 bg-gray-500/50' : ''
    "
    @click.self="isModalOpen2 = false">
    <div :class="`bg-white absolute inset-0 m-auto z-5 ${size()}}`">
      <slot />
    </div>
  </div>
</template>
