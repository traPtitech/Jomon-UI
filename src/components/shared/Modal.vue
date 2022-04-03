<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGeneralStore } from '../../stores/general'

type Props = { width: number; height: number; layer: number }
const props = defineProps<Props>()

const generalStore = useGeneralStore()
const { isModalOpen, isModalOpen2 } = storeToRefs(generalStore)
</script>

<template>
  <div
    v-if="props.layer === 1"
    @click.self="isModalOpen = false"
    :class="isModalOpen ? 'fixed h-screen w-screen z-2 bg-gray-500/50' : ''"
  >
    <div
      :class="`bg-white absolute z-3 inset-0 m-auto overflow-y-scroll w-${props.width} h-${props.height} z-3`"
    >
      <slot></slot>
    </div>
  </div>
  <div
    v-if="props.layer === 2"
    @click.self="isModalOpen2 = false"
    :class="isModalOpen2 ? 'fixed h-screen w-screen z-4 bg-gray-500/50' : ''"
  >
    <div
      :class="`bg-white absolute z-3 inset-0 m-auto w-${props.width} h-${props.height} z-5
      }`"
    >
      <slot></slot>
    </div>
  </div>
</template>
